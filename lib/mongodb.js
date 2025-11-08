import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || ''

if (!MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not set. Copy .env.example to .env and set MONGO_URI (mongodb+srv://... or mongodb://...).')
}

let cached = global.mongoose

if (!cached) cached = global.mongoose = { conn: null, promise: null }

export async function connectToDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const opts = { bufferCommands: false }
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
