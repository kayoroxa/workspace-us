// global.d.ts
import { MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Permite que este arquivo seja tratado como um módulo
export {}
