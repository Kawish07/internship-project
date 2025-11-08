import { connectToDB } from '../../../lib/mongodb'
import Ad from '../../../models/Ad'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

export async function GET(request) {
  await connectToDB()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const query = {}
  if (category && category !== 'All') query.category = category
  if (q) query.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } }
  ]
  const limit = 9
  const skip = (Math.max(1, page) - 1) * limit
  const ads = await Ad.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
  // attach poster name quickly
  const userIds = [...new Set(ads.map(a => a.userId?.toString()).filter(Boolean))]
  const users = {}
  if (userIds.length) {
  const User = (await import('../../../models/User')).default
    const ulist = await User.find({ _id: { $in: userIds } }).lean()
    ulist.forEach(u => { users[u._id.toString()] = u })
  }
  const out = ads.map(a => ({ ...a, postedBy: users[a.userId?.toString()]?.name }))
  return new Response(JSON.stringify(out), { status: 200 })
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await request.json()
  await connectToDB()
  const ad = await Ad.create({
    title: body.title,
    description: body.description,
    category: body.category,
    price: body.price,
    image: body.image,
    userId: session.user.id
  })

  return new Response(JSON.stringify(ad), { status: 201 })
}
