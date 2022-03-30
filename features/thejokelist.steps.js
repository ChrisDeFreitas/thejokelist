/*
  thejokelist.steps.js
  by Chris DeFreitas

  usage:
  $ npx cucumber.js

*/

const { BeforeAll, AfterAll, Given, Then } = require('@cucumber/cucumber')
const assert = require('assert').strict

const FireFoxWorld = require( "./firefox.world.js" )
const browser = new FireFoxWorld( {} )
// fails to affect "this" property:
// setWorldConstructor( FireFoxWorld )


const log = console.log;
// const url = 'https://thejokelist.netlify.app/'
const url = 'http://localhost:4000/'

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
});
Then('a new joke appears', async function () {
  
  let el = await browser.qry( '#title' )
  let newTitle = await el.getText()
  
  assert.equal( true, ( newTitle !== lastTitle ))
});

// next joke feature
var lastid = null
Given('the Right Arrow is clicked', async function () {

  let joke = await browser.exec('return joke;')
  lastid = joke.id

  let el = await browser.qry( '#next' )
  el.click()
});
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
});
Then('the next joke with an id smaller than the last appears', async function () {

  let joke = await browser.exec('return joke;')
  let newid = joke.id

  assert.equal( true, ( newid < lastid ))
})
