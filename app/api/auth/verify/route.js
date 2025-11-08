import { connectToDB } from '../../../lib/mongodb'
import User from '../../../../models/User'

export async function GET(request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 })

  await connectToDB()
  const user = await User.findOne({ verificationToken: token })
  if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 400 })
  if (user.verificationExpires && user.verificationExpires < new Date()) return new Response(JSON.stringify({ error: 'Token expired' }), { status: 400 })

  user.emailVerified = true
  user.verificationToken = undefined
  user.verificationExpires = undefined
  await user.save()
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
