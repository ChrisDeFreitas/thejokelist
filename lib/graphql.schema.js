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
  await api.init( storageName, false, true )
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

// let requestid = 0
var root = {
  test: () => {
    // let rid = requestStart( 'test' )
    let txt = 'Hello world!'
    // requestDone( 'test', rid )
    return txt
  },
  maxRows: () => {
    // let rid = requestStart( 'maxRows' )
    let ii = api.maxRows()
    // requestDone( 'maxRows', rid )
    return ii
  },
  next: async ({ id }) => {
    // let rid = requestStart( 'next()' )
    const row = await api.next( id )
    // requestDone( 'next()', rid )
    return row
  },
  prior: async ({ id }) => {
    // let rid = requestStart( 'prior()' )
    const row = await api.prior( id )
    // requestDone( 'prior()', rid )
    return row
  },
  random: async () => {
    // let rid = requestStart( 'random()' )
    const row = await api.random()
    // requestDone( 'random()', rid )
    return row
  },
  find: async ({ txt }) => {
    // let rid = requestStart( 'find()' )
    const rows = await api.find( txt )
    // requestDone( 'find()', rid )
    return rows
  }
}

exports.schema = schema
exports.root = root