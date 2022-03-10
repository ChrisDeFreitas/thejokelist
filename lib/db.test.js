/*
  db.test.js
  by Chris DeFreitas
  - test database interface: db.js

 */
'use strict'

const expect = require('chai').expect

const db = require('./db.js')
const storageName = './db/jokelist.sqlite'  // test is run relative to project root
// const storageName = ':memory:'
var model = null
var row = null

before( async () => {
  // await db.init( storageName, console.log, true )
  await db.init( storageName, false, true )
})

after( async () => {
  if( db.inited() )
    await db.close()
})


describe.skip('test db.init()', () => {

  it(`Is file, "${storageName}", created`, () => {
    if( storageName === ':memory:')
      return true

    const { existsSync } = require( 'fs' )
    let result = existsSync( storageName )
    expect( result ).to.equal( true )
  })

  it('Are models created', () => {
    let model = db.modelGet( 'joke' )
    expect( typeof model ).to.equal( 'function' )
    expect( typeof model.build ).to.equal( 'function' )
  })

})

describe.skip('test db.modelGet()', () => {

  it('model.create()', async () => {
    model = db.modelGet( 'joke' )

    expect( typeof model ).to.equal( 'function' )
    expect( typeof model.build ).to.equal( 'function' )

    row = await model.create({ title:'test' })     // returns new model Instance (difers from Model)
    expect( row instanceof model ).to.equal( true )
    expect( row.title ).to.equal( 'test' )
  })

  it('model.set()/save()', async () => {
    expect( row instanceof model ).to.equal( true )
    expect( row.title ).to.equal( 'test' )

    let txt = new Date().toString()
    row.set({     // set in memory data
      score: 11,
      body: txt,
    })

    await row.save()    //validate and persist changes to database
    expect( row.score ).to.equal( 11 )
    expect( row.body ).to.equal( txt )

    let where = { where: { body:txt }}
    let cnt = await model.count(where)
    expect( cnt ).to.equal( 1 )
    
    let result = await model.findAll( where )   // result is array 
    expect( result.length ).to.equal( 1 )
    expect( result[0].dataValues.body ).to.equal( txt )
  })
})


describe.skip('test db.rowCreate(), db.rowUpdate(), db.rowFindAll', () => {
  it('save, find then update', async () => {

    let txt = new Date().toString() +'test2'
    let newrow = await db.rowCreate('joke', {
      score: 33,
      title: 'bees',
      body: txt,
    })
    expect( newrow.body ).to.equal( txt )

    let rowfnd = await db.rowFindAll( 'joke', { body:txt } )
    expect( rowfnd.length ).to.equal( 1 )
    expect( rowfnd[0].body ).to.equal( newrow.body )

    rowfnd = await db.rowUpdate( rowfnd[0], {title:'wax'} )
    expect( rowfnd.title ).to.equal( 'wax' )
    expect( rowfnd.title ).not.to.equal( newrow.title )
  })
})

describe('test db.query(), db.FindOne(), db.rowFindAll against sqlite file', () => {

  it('test db.query', async () => {
    const list = await db.query( 'SELECT * FROM `joke` WHERE `title` LIKE "%the%" ')
    expect( list ).not.equal( null )
    expect( Array.isArray( list )).to.equal( true )
    expect( list.length ).to.be.greaterThan( 1 )
    // console.log('query result:', list )
  })
  it('test db.rowFindAll', async () => {
    const { Op } = require("sequelize")
    let list = await db.rowFindAll( 'joke', {
      attributes:[ 'id', 'title', 'body', 'category', 'score' ],
      where:{ title:{ [Op.substring]:'the' }}
    })
    expect( list ).not.equal( null )
    expect( Array.isArray( list )).to.equal( true )
    expect( list.length ).to.be.greaterThan( 1 )
    // console.log(111, list, 222 )
  })
  it('test db.rowFindAll', async () => {
    const { Op } = require("sequelize")
    let list = await db.rowFind( 'joke', {
      attributes:[ 'id', 'title', 'body', 'category', 'score' ],
      where:{ title:{ [Op.substring]:'the' }},
    })
    expect( list ).not.equal( null )
    expect( typeof( list )).to.equal( 'object' )
    // console.log(111, list, 222 )
  })

})


describe.skip('test db.schemaObjDef()', () => {
  it.skip('visually inspect', () => {
    console.log("db.schemaObjDef( 'joke' ):\n", db.schemaObjDef( 'joke' ))
    expect( true ).to.equal( true )
  })
})

