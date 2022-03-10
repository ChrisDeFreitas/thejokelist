/*
  JokeListApi.test.js
  by Chris DeFreitas
  - test api interface: JokeListApi.js

  ToDo:
  - test failure return values from api.next(), api.find(),
*/
'use strict'

const expect = require('chai').expect

const { api } = require('./JokeListApi')
const storageName = './db/jokelist.sqlite'  // test is run relative to project root


before( async () => {
  // await db.init( storageName, console.log, true )
  await api.init( storageName, false, true )
})


describe('test api.next(),random(),find()', () => {

  it(`get first row`, async () => {
    let row = await api.next()
    // console.log( 111, list )
    expect( row ).not.equal( null )
    expect( Array.isArray( row )).to.equal( false )
    expect( row['id'] ).not.equal( null )
  })

  it('get next row', async () => {
    let row = await api.next( 3 )
    // console.log( 111, list )
    expect( row ).not.equal( null )
    expect( Array.isArray( row )).to.equal( false )
    expect( row.id ).to.equal( 4 )
  })

  it(`get random row`, async () => {
    let row = await api.random()
    // console.log( 111, list )
    expect( row ).not.equal( null )
    expect( Array.isArray( row )).to.equal( false )
    expect( row['id'] ).not.equal( null )
  })

  it(`find "the" in joke.body`, async () => {
    let list = await api.find( 'the' )
    // console.log( 111, list )
    expect( list ).not.equal( null )
    expect( Array.isArray( list )).to.equal( true )
    expect( list.length ).to.be.greaterThan( 1 )
    expect( list[0]['id'] ).not.equal( null )
  })

})
