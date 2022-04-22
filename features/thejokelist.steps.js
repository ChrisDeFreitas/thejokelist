/*
  thejokelist.steps.js
  by Chris DeFreitas

  usage:
  $ npx cucumber.js

*/

const { BeforeAll, AfterAll, Given, Then } = require('@cucumber/cucumber')
const assert = require('assert').strict
const axios = require('axios')

const FireFoxWorld = require( "./firefox.world.js" )
const browser = new FireFoxWorld( {} )
// fails to affect "this" property:
// setWorldConstructor( FireFoxWorld )


const log = console.log;
// const url = 'http://localhost:8888/'      // netlify-cli server
// const url = 'https://thejokelist.netlify.app/'
const url = 'http://localhost:4000/'   // express-graphql

BeforeAll( {timeout: 20 * 1000}, async function() {
  log('Init...')
  // await this.init()
  await browser.init()
})
AfterAll( async function () {
  log('Done.')
  // await this.quit()
  await browser.quit()
})


// initial joke feature
Given('the home page is displayed', async function () {

  await browser.open( url )
  await browser.sleep( 1000 )   // pause for the initial api call to complete

  let result = await browser.exists( '.controls' )
  assert.equal( true, result)
})
Then('a joke is displayed', async function () {

  let el = await browser.qry( '#title' )
  let txt = await el.getText()

  assert.equal( true, ( txt !== 'Loading joke...' ))
})

// random joke feature
let lastTitle = null // for testing
Given('the question mark is clicked', async function () {
  
  let el = await browser.qry( '#title' )
  lastTitle = await el.getText()

  el = await browser.qry( '#random' )
  el.click()
  await browser.sleep( 1000 )   // pause for the initial api call to complete
})
Then('a new joke appears', async function () {
  
  let el = await browser.qry( '#title' )
  let newTitle = await el.getText()
  
  assert.equal( true, ( newTitle !== lastTitle ))
})

// next joke feature
var lastid = null
Given('the Right Arrow is clicked', async function () {

  let joke = await browser.exec('return joke;')
  lastid = joke.id

  let el = await browser.qry( '#next' )
  el.click()
  await browser.sleep( 1000 )   // pause for the initial api call to complete
})
Then('the next joke with an id larger than the last appears', async function () {

  let joke = await browser.exec('return joke;')
  let newid = joke.id

  assert.equal( true, ( newid > lastid ))
})

// prior joke feature
Given('the Left Arrow is clicked', async function () {

  let joke = await browser.exec('return joke;')
  lastid = joke.id

  let el = await browser.qry( '#last' )
  el.click()
  await browser.sleep( 1000 )   // pause for the initial api call to complete
})
Then('the next joke with an id smaller than the last appears', async function () {

  let joke = await browser.exec('return joke;')
  let newid = joke.id

  assert.equal( true, ( newid < lastid ))
})


// id() feature
lastid = 22
Given('the id enpoint is called with a joke.id', async function () {
  let world = this
  let endpoint = url +`graphql/?query={id( id:${lastid} ) {id, title, body} }`

  // @ts-ignore
  await axios.get( endpoint )
  .then(function (response) {
    world.response = response
  })
  .catch(function (error) {
    world.response = error.response
    // log( 'Endpoint call failed with:\n', error.toString() ) 
    // return false
  })
  return true
})
Then('the returned status equals 200', function () {
  assert.equal( 200, this.response.status )
})
Then('the returned joke has the same joke.id', function () {
  assert.equal( lastid, this.response.data.data.id.id )
})       
