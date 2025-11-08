#!/usr/bin/env node
/**
 * Simple script to test MongoDB connection using MONGO_URI from env.
 * Usage: node scripts/check-mongo.js
 */
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

async function run() {
  console.log('MONGO_URI present?', !!MONGO_URI)
  if (!MONGO_URI) {
    console.error('\nERROR: MONGO_URI is not set in environment.')
    console.error('Set it (e.g. mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/dbname?retryWrites=true&w=majority')
    process.exit(1)
  }

  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI, { bufferCommands: false })
    console.log('Connected to MongoDB OK')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('\nConnection failed:')
    console.error(err && err.message ? err.message : err)
    if (err && err.reason && err.reason.topologyDescription) {
      console.error('Topology:', JSON.stringify(err.reason.topologyDescription, null, 2))
    }
    process.exit(2)
  }
}

run()
