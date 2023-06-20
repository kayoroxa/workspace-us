const db = require('./db.json')
const fs = require('fs')
const dbCleaned = {
  ...db,
  options: db.options.map(v => ({
    ...v,
    countReview: 0,
    isOnBoard: false,
  })),
  sentences: [],
}

fs.writeFileSync('./db.json', JSON.stringify(dbCleaned, null, 2))
