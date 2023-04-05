import { Client } from 'faunadb'

export const faunaClient = new Client({
  secret: 'fnAFAw9AWBACV-WkTeV0VwWkFPDl895T6-G7vJhF',
  // secret: process.env.FAUNADB_KEY || '',
  // domain: process.env.FAUNA_DOMAIN,
})
