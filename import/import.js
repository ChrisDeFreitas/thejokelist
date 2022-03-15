/*

  Initial import:
    reddit_jokes
      99 rows with: score >= 16000 && body.length > 0 && <= 300
    stupidstuff - none     
    Wocka - none
//      4855 rows with: body.length > 0 && <= 300
//      5163 skipped

  Datasource:
    https://github.com/taivop/joke-dataset
    
*/

const db = require('../lib/db.js')
// const storageName = './import.sqlite'
const storageName = ':memory:'

const json5 = require('json5')
const fs = require('fs')

let buf = ''
let start = 0
let end = 0
let offset = 0
let cnt = saved = skipped = 0
function next(  ){
  start = buf.indexOf( '{', offset )
  if( start === -1 ) return false
  let end = buf.indexOf( '},', start )
  if( end === -1 ) return false
  offset = end
  
  return buf.substring( start, end+1 )  
}
async function save( obj ){
  await db.rowCreate('joke', obj )
//  let rowfnd = await db.rowFindAll( 'joke', obj )
//  console.log( 'fnd:', rowfnd )
}

(async () => {    // Immediately Invoked Function Expression

  await db.init( storageName, false, true )

  buf = fs.readFileSync( './reddit_jokes.json', {encoding:'utf8', flag:'r'} )
//  buf = fs.readFileSync( './stupidstuff.json', {encoding:'utf8', flag:'r'} )
//  buf = fs.readFileSync( './wocka.json', {encoding:'utf8', flag:'r'} )
  let source = 'reddit_jokes'
  let str = ''
//let score = 0

  while( str !== false ){
    str = next()
    if( str === false ) break
    let obj = json5.parse( str )
    obj.source = source
    if( obj.id ){
      obj.id_original = obj.id
      delete obj.id
    }
    if( obj.score ) obj.score = Number( obj.score )
    cnt++
    
//    if( cnt === 1 ) break
    if( typeof obj === 'object' 
    && obj.score >= 16000
//    && Number( obj.rating ) >= 5
    && obj.body !== ''
    && obj.body.length <= 300
    ){
      await save( obj )
      saved++
      console.log( saved+'/'+cnt, obj )
//      if( obj.score > score ) score = obj.score
//      if( Number(obj.rating) > score ) score = Number(obj.rating)
    } 
    else
      skipped++
  }

  db.close()
  console.log( 'Done:', 'total=' +cnt, 'saved=' +saved, 'skipped=' +skipped )
})()