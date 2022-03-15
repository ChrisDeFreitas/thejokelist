/*
  prior.js
  by Chris DeFreitas
  - return joke with prior joke.id
  - args: joke.id, integer

  testing:
    see test.js for reference

*/
'use strict'

const {db} = require('../dbhub.js')

exports.handler = async function (event, context) {
  try {

    // console.log('prior() query params:', event.queryStringParameters)
    // console.log('prior() post params:', event.body)

    let id = event.queryStringParameters.id
    if( id === undefined ){
      let obj = JSON.parse(event.body)
      id = obj.id
    }
    // console.log( 'prior() id:', id)

    let row = await db.prior( id )

    return {
      statusCode: 200,
      body: JSON.stringify( row ),
    }

  } catch (error) {
    return { statusCode: 500, body: 'prior() error, ' +error.toString() }
  }
}
