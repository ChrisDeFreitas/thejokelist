/*
  graphql.schema.js
  Chris DeFreitas
  - used by JokeList API 

  references:
    https://graphql.org/learn/

*/

const { buildSchema } = require('graphql')

const { api } = require('./JokeListApi')
const storageName = './db/jokelist.sqlite'  // test is run relative to project root

;( async function(){
  await api.init( storageName )
})()

const schema = buildSchema(`
  type JokeRow {
    id: Int
    title: String
    body: String
    category: String
    score: Float
  }
  type Query {
    test: String,
    maxRows: Int,
    next( id: Int ): JokeRow,
    prior( id: Int ): JokeRow,
    random: JokeRow,
    find( txt: String ): [JokeRow]
  }
""" 
  Multi-line comment
"""
  type JokeList {
      " Single line comment "
      maxRows: Int,
      next( id:Int ): JokeRow
      prior( id:Int ): JokeRow
      random: JokeRow
      find( txt:String ): [JokeRow]
  }
`)

var root = {
  test: () => {
    let txt = 'Hello world!'
    return txt
  },
  maxRows: () => {
    let ii = api.maxRows()
    return ii
  },
  next: async ({ id }) => {
    const row = await api.next( id )
    return row
  },
  prior: async ({ id }) => {
    const row = await api.prior( id )
    return row
  },
  random: async () => {
    const row = await api.random()
    return row
  },
  find: async ({ txt }) => {
    const rows = await api.find( txt )
    return rows
  }
}

exports.schema = schema
exports.root = root