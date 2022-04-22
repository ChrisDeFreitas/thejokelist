/*
  id.js
  by Chris DeFreitas
  - return joke with joke.id = id
  - args: joke.id, integer

  testing:
    see test.js for reference

*/
'use strict'

const {db} = require('../dbhub.js')

exports.handler = async function (event, context) {
  try {

    console.log('id() query params:', event.queryStringParameters)
    console.log('id() post params:', event.body)

    let id = event.queryStringParameters.id
    if( id === undefined ){
      let obj = JSON.parse(event.body)
      id = obj.id
    }
    console.log( 'id() id:', id)

    let row = await db.id( id )

    return {
      statusCode: 200,
      body: JSON.stringify( row ),
    }

  } catch (error) {
    return { statusCode: 500, body: 'id() error, ' +error.toString() }
  }
}
