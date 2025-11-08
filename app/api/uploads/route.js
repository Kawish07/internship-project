import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  // Cloudinary requires a Buffer/stream; fetch file blob
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary env vars missing', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing'
    })
    return NextResponse.json({ error: 'Cloudinary not configured on server' }, { status: 500 })
  }

  try {
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`
    const result = await cloudinary.v2.uploader.upload(dataUri, { folder: `advertease/${session.user.id}`, resource_type: 'image' })
    if (!result || !result.secure_url) {
      console.error('Cloudinary upload returned unexpected result', result)
      return NextResponse.json({ error: 'Upload failed, no url returned' }, { status: 500 })
    }
    return NextResponse.json({ url: result.secure_url })
  } catch (e) {
    console.error('Cloudinary upload error:', e && e.stack ? e.stack : e)
    const message = e && e.message ? e.message : 'Upload failed'
    // detect signature issues
    if (message.toLowerCase().includes('invalid signature') || message.toLowerCase().includes('signature')) {
      return NextResponse.json({ error: 'Invalid Cloudinary signature — check CLOUDINARY_API_SECRET and ensure there are no extra spaces or quotes in your .env' }, { status: 500 })
    }
    const msg = process.env.NODE_ENV === 'development' ? message : 'Upload failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
