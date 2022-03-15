/*
  review.js

*/

const db = require('../lib/db.js')
const storageName = './review.sqlite'
// const storageName = ':memory:'

const json5 = require('json5')
const fs = require('fs')

const prompts = require('prompts')

let source = ''   // souce file
let buf = ''
let start = 0
let end = 0
let offset = 0
let cnt = saved = skipped = 0
let row = null
function next(){
  start = buf.indexOf( '{', offset )
  if( start === -1 ) return false
  let end = buf.indexOf( '},', start )
  if( end === -1 ) return false
  offset = end
  
  return buf.substring( start, end+1 )  
}
function init_file(){
   buf = ''
   start = 0
   end = 0
   offset = 0
  buf = fs.readFileSync( source +'.json', {encoding:'utf8', flag:'r'} ) 
}
function makeRow( str ){
  let obj = json5.parse( str )
  obj.source = source
  if( obj.id ){
    obj.id_original = obj.id
    delete obj.id
  }
  if( obj.score ) obj.score = Number( obj.score )
  obj.rownum = cnt
  return obj
}
function getRow( num ){
  let str = null

  while( num > cnt ){
    str = next()
    if( str === false ) return null
    ++cnt
  }
  return makeRow( str )
}
function getRowByID( id_original ){
  let fnd = false
  let obj = null
  while( fnd === false ){
    let str = next()
    if( str === false ) return null
    ++cnt
    obj = makeRow( str )
    // console.log( obj.id_original )
    if( String(obj.id_original) === id_original){
      fnd = true
      break
    }
  }
  return obj
}

async function saveRow( obj ){
  await db.rowCreate('joke', obj )
}
async function gotoLastSaved(){
  let sql = `select id_original
  from joke
  where source="${source}"
  order by id_original ${source==='reddit_jokes' ?'asc' :'desc'}
  limit 1
  `.trim()
  const list = await db.query( sql )
  let row = null

  console.log( sql, list )
  if( list.length > 0){
    let id_original = list[0].id_original
    row = getRowByID( id_original )
  }
  else{
    console.log( 'No saved rows found.  Displaying row #1.' )
    row = getRow( 1 )
  }
  return row
}

const init_prompts =[
  {
    type: 'autocomplete',
    name: 'datafile',
    message: 'Select datafile',
    choices: [
      { title: 'reddit_jokes' },
      { title: 'stupidstuff' },
      { title: 'wocka' }
    ]
  },{
    type: 'autocomplete',
    name: 'from',
    message: 'Start from',
    choices: [
      { title: 'first' },
      { title: 'goto row#' },
//      { title: 'goto id' },
      { title: 'last saved' },
      { title: 'quit' }
    ]    
  },{
    type: prev => ( prev.indexOf('goto') === -1 ? null : 'number' ),
    name: 'num',
    message: prev => `Enter ` +( prev === 'goto row#' ? 'row#' : 'id'),
  }
]
const row_prompts =[
  {
    type: 'autocomplete',
    name: 'next',
    message: 'Next',
    choices: [
      { title: 'next' },
//      { title: 'prior' },
      { title: 'save' },
      { title: 'quit' }
    ]    
  }
]

async function handleReponse( response ){

  if( response.from ){
    init_file()    
    if( response.from === 'quit' ){
      done()
      return
    } else
    if( response.from === 'first' )
      row = getRow( 1 )
    else
    if( response.from === 'goto row#' ){
      row = getRow( response.num )
    } else
    if( response.from === 'last saved' ){
      row = await gotoLastSaved()
    }
  } else
  if( response.next ){    
    if( response.next === 'save' ){
      await saveRow( row )
      saved++
      console.log( 'saved.' )
      row = getRow( row.rownum +1 )
    }
    else
    if( response.next === 'quit' ){
      done()
      return
    } else
    if( response.next === 'next' )
      row = getRow( row.rownum +1 )
  }
  
  if( row === null ){
    console.log( 'Row not found.  Exiting.' )
    done()
    return
  }
  else {
    console.log( row ) 
    response = await prompts( row_prompts )
    handleReponse( response )
  }

}
async function done(){
  await db.close()
  console.log( 'Done:', 'last rownum=' +cnt, 'saved=' +saved, 'skipped=' +skipped )
}
;( async () => {
  
  console.clear() 
  await db.init( storageName, false, true )

  let response = await prompts( init_prompts )
  if( response.from === 'quit' ) return

  source = response.datafile  
  handleReponse( response )
  
})()

