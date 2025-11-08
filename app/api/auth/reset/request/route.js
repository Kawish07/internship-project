import { connectToDB } from '../../../lib/mongodb'
import User from '../../../../../models/User'
import crypto from 'crypto'

export async function POST(request) {
  const { email } = await request.json()
  if (!email) return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 })
  await connectToDB()
  const user = await User.findOne({ email })
  if (!user) return new Response(JSON.stringify({ ok: true }), { status: 200 })

  const token = crypto.randomBytes(20).toString('hex')
  user.resetToken = token
  user.resetExpires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
  await user.save()

  // In prod, send email with token link. Here we return token for convenience.
  return new Response(JSON.stringify({ ok: true, token }), { status: 200 })
}
