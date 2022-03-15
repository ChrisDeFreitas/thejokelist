/*
  random.js
  by Chris DeFreitas
  - return a random joke

  testing:
    see test.js for details

*/
'use strict'

const {db} = require('../dbhub.js')

exports.handler = async function (event, context) {
  try {

    let row = await db.random()

    return {
      statusCode: 200,
      body: JSON.stringify( row ),
    }

  } catch (error) {
    return { statusCode: 500, body: 'random() error, ' +error.toString() }
  }
}
