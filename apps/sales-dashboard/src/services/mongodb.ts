// src/services/mongodb.ts
import { MongoClient } from 'mongodb'

const URI = 'mongodb+srv://kayoroxa:devisme@cluster0.wq5an5y.mongodb.net/'
const options = {}

if (!URI) throw new Error('Please add your Mongo URI to .env.local')

let client = new MongoClient(URI, options)
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV !== 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = client.connect()
}

export default clientPromise
