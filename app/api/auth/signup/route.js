import { connectToDB } from '../../../../lib/mongodb'
import User from '../../../../models/User'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export async function POST(request) {
  const body = await request.json()
  const { name, email, password } = body
  if (!name || !email || !password) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })

  await connectToDB()
  const exists = await User.findOne({ email })
  if (exists) return new Response(JSON.stringify({ error: 'User exists' }), { status: 409 })

  const hash = await bcrypt.hash(password, 10)
  const token = crypto.randomBytes(20).toString('hex')
  const user = await User.create({ name, email, password: hash, verificationToken: token, verificationExpires: new Date(Date.now()+1000*60*60*24) })

  // In production, send email with link: `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`
  return new Response(JSON.stringify({ id: user._id, email: user.email, name: user.name, verificationToken: token }), { status: 201 })
}
