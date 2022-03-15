/*
  db.test.js
  by Chris DeFreitas
  - test dbhub.io interface: dbhub.js

 */
'use strict'

const expect = require('chai').expect
const {db} = require('./dbhub.js')

const selectCols = 'id, title, body, category, score'

describe('test dbhub.query', () => {

  it.skip(`test count(*)`, async () => {

    let sql = 'Select count(*) from Joke'
    let rows = await db.query( sql )
    let row = rows[0]
    console.log( 111, row )
    expect( row['count(*)'] ).to.not.equal( undefined )
    expect( Number( row['count(*)'] )).to.not.equal( NaN )
  })

  it.skip(`test random joke query`, async () => {

    const crypto = require("crypto")
    let num = crypto.randomInt( 1, 99)
    let sql = `
Select * from (
Select ${selectCols}, row_number() over (order by id) as rownum
from joke
)
where rownum = ${num}
        `.trim()
    let rows = await db.query( sql )
    let row = rows[0]
    console.log( 111, JSON.stringify( rows, null, 2) )
    expect( typeof row ).to.equal( 'object' )
    expect( Number( row.id )).to.not.equal( NaN )
  })

  it.skip(`test next id query`, async () => {

    let num = 30
    let sql = `Select ${selectCols} from joke Where id >= ${num} Order by id Limit 1`
    let rows = await db.query( sql )
    let row = rows[0]
    console.log( 111, JSON.stringify( rows, null, 2) )
    expect( typeof row ).to.equal( 'object' )
    expect( Number( row.id )).to.not.equal( NaN )
  })

  it.skip(`test prior id query`, async () => {

    const crypto = require("crypto")
    let num = 30
    let sql = `Select ${selectCols} from joke Where id <= ${num} Order by id desc Limit 1`
    let rows = await db.query( sql )
    let row = rows[0]
    console.log( 111, JSON.stringify( rows, null, 2) )
    expect( typeof row ).to.equal( 'object' )
    expect( Number( row.id )).to.not.equal( NaN )
  })

})

describe('test dbhub.query', () => {

  it(`test dbhub.random()`, async () => {

    let row = await db.random()
    console.log( 111, JSON.stringify( row, null, 2) )
    expect( typeof row ).to.equal( 'object' )
    expect( Number( row.id )).to.not.equal( NaN )

  })  

})
  
  