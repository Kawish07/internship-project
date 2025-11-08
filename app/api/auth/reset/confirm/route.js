import { connectToDB } from '../../../lib/mongodb'
import User from '../../../../../models/User'
import bcrypt from 'bcrypt'

export async function POST(request) {
  const { token, password } = await request.json()
  if (!token || !password) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  await connectToDB()
  const user = await User.findOne({ resetToken: token })
  if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 400 })
  if (user.resetExpires && user.resetExpires < new Date()) return new Response(JSON.stringify({ error: 'Expired' }), { status: 400 })

  user.password = await bcrypt.hash(password, 10)
  user.resetToken = undefined
  user.resetExpires = undefined
  await user.save()
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
