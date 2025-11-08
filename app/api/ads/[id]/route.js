import { connectToDB } from '../../../../lib/mongodb'
import Ad from '../../../../models/Ad'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET(request, { params }) {
  await connectToDB()
  const ad = await Ad.findById(params.id).lean()
  if (!ad) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  return new Response(JSON.stringify(ad), { status: 200 })
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  await connectToDB()
  const ad = await Ad.findById(params.id)
  if (!ad) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  if (ad.userId.toString() !== session.user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

  const body = await request.json()
  ad.title = body.title
  ad.description = body.description
  ad.category = body.category
  ad.price = body.price
  ad.image = body.image
  await ad.save()

  return new Response(JSON.stringify(ad), { status: 200 })
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  await connectToDB()
  const ad = await Ad.findById(params.id)
  if (!ad) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  if (ad.userId.toString() !== session.user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

  // If image stored in Cloudinary, try to remove (assumes public_id stored)
  try {
    if (ad.image && ad.image.includes('res.cloudinary.com')) {
      // Best-effort: extract public_id
        const parts = ad.image.split('/')
      const last = parts[parts.length - 1]
      const [publicId] = last.split('.')
      await cloudinary.v2.uploader.destroy(publicId)
    }
  } catch (e) {
    console.warn('Cloudinary delete failed', e)
  }

  await ad.deleteOne()
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
