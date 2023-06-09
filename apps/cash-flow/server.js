const jsonServer = require('json-server')
require('dotenv').config({ path: './.env.local' })

const fs = require('fs')

const JSON_DB_PATH = process.env.JSON_DB_PATH || './db.json'
const BACK_PORT = process.env.BACK_PORT || 4011

function makeCopy() {
  const jsonString = fs.readFileSync(JSON_DB_PATH, 'utf8')

  fs.writeFileSync(`${JSON_DB_PATH.replace('.json', '_copy.json')}`, jsonString)
}

const myMiddlewares = (req, res, next) => {
  // const entriesQuery = Object.entries(req.query)
  // const hasNull = entriesQuery.some(([_, value]) => value === 'null')
  // const stepTasks = req.url === '/steptasks?dashboard=true'

  // if (req.method === 'POST') {
  //   const jsonString = fs.readFileSync(JSON_DB_PATH, 'utf8')
  //   const data = JSON.parse(jsonString)

  //   const param = req.url.match(/\w+/g)?.[0]

  //   if (!Object.keys(data).includes(param)) {
  //     data[param] = []
  //     fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data))
  //   }
  // }

  if (
    req.method === 'DELETE' ||
    req.method === 'PATCH' ||
    req.method === 'PUT'
  ) {
    makeCopy()
  }

  next()
}

const server = jsonServer.create()
const router = jsonServer.router(JSON_DB_PATH)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(myMiddlewares)
server.use(router)
server.listen(BACK_PORT, () => {
  console.log('JSON Server is running on port:', BACK_PORT)
})
