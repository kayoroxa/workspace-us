import { Client } from 'faunadb'

export const faunaClient = new Client({
  secret: process.env.FAUNADB_KEY || '',
  // domain: process.env.FAUNA_DOMAIN,
})
