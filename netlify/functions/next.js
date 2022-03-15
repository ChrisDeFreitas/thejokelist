/*
  next.js
  by Chris DeFreitas
  - return joke with next joke.id
  - args: joke.id

  testing:
    see test.js for details

*/
'use strict'

const {db} = require('../dbhub.js')

exports.handler = async function (event, context) {
  try {

    console.log('next() query params:', event.queryStringParameters)
    console.log('next() post params:', event.body)

    let id = event.queryStringParameters.id
    if( id === undefined ){
      let obj = JSON.parse(event.body)
      id = obj.id
     }
    // console.log( 'next() id:', id)

    let row = await db.next( id )
    // console.log( 'next() result:', row)

    return {
      statusCode: 200,
      body: JSON.stringify( row ),
    }

  } catch (error) {
    return { statusCode: 500, body: 'next() error, ' +error.toString() }
  }
}
