/*
  dbhub.js
  by Chris DeFreitas
  - interface for dbhub.io queries
  - used by netlify app to access the joke list database

*/
'use strict'

const axios = require('axios').default

class db {

  apikey = null
  dbowner = null
  dbname = null
  selectCols = 'id, title, body, category, score'

  constructor(){
    // get credentials from env
    this.apikey = process.env.DBHUBapikey
    this.dbowner = process.env.DBHUBdbowner
    this.dbname = "jokelist.sqlite"
    console.log('dbhub.dbowner', this.dbowner)
  }

  async random(){

    const crypto = require("crypto")
    let num = crypto.randomInt( 1, 99)

    let sql = `
Select * from (
Select ${this.selectCols}, row_number() over (order by id) as rownum
from joke
)
where rownum = ${num}
        `.trim()
    let rows = await this.query( sql )
    let row = rows[0]
    // console.log( 111, JSON.stringify( rows, null, 2) )

    return row
  }

  async next( id ){

    let sql = `Select ${this.selectCols} from joke `
    if( id !== null){
      let num = Number( id )
      if( isNaN( num ))
        throw new Error(`JokeListApi.next() error, id is not a number:[${id}]`)
      if( num >= this.lastid ) num = this.firstid
      else num++
      sql +=`Where id >= ${num} `
    }
    sql += 'Order by id Limit 1'
    // console.log('sql', sql)

    let rows = await this.query( sql )
    let row = rows[0]

    return row
  }

  async prior( id ){

    let sql = `Select ${this.selectCols} from joke `
    if( id !== null){
      let num = Number( id )
      if( isNaN( num ))
        throw new Error(`JokeListApi.prior() error, id is not a number:[${id}]`)
      if( num <= this.firstid ) num = this.lastid
      else num--
      sql +=`Where id <= ${num} `
    }
    sql += 'Order by id desc Limit 1'
    // console.log('sql', sql)

    let rows = await this.query( sql )
    if( rows.length  === 0)
      return null
    return rows[0]
  }

  async query( sql ){
    if( this.apikey === null 
     || this.dbowner === null 
     || this.dbname === null )
      throw new Error(`dbhub.exec() error, DBHub.io credentials not found.`)

    // const callback = function( type, obj, callbackData = null, progressnum = null ){
    //   if( type === 'progress' ) return     // nothing to do
    //   if( type === 'error' ) return     // nothing to do
    //   // console.log( 'cb:', type, obj )
    //   // type === response
    //   let data = obj.data
    //   console.log( 'callback:', obj.status, obj.statusText )
    //   console.log( 'data:', data )
    // }
    
    // let sql = 'Select count(*) from Joke'
    let sql_b64 = Buffer.from( sql ).toString('base64')
    
    let result = await this.axios(
      'post',
      'https://api.dbhub.io/v1/query',
      null, 
      {
        apikey: this.apikey,
        dbowner: this.dbowner,
        dbname: this.dbname,
        sql: sql_b64  // "U2VsZWN0IGNvdW50KCopIGZyb20gam9rZSAg"      
      },
      false,   // debug
      null,   // data returned to callback
      null,   // callback
    )

    if( Array.isArray( result) === false ){  // error occurred
      return result
    }
    
    // result = 
    // [ 
    //   [ 
    //     { Name: 'id', Type: 4, Value: '85' }, 
    //     ...
    //   ],
    //   ...
    // ]
    // convert to: [ {id:85, ... }, ... ]
    let rows = []
    let row = null
    result.forEach( cols=> {  //  cols = [ { Name: 'id', Type: 4, Value: '85' }, ... ]
      row = {}
      cols.forEach( col => {
        row[ col.Name ] = col.Value
      })
      rows.push( row )
    })
    return rows
  }
  async axios(    // for server calls
    method,   // get, post, put
    url = '', 
    headers = null,
    data = null,
    debug = false,
    callbackData = null,   // returned to callback
    callback = null, 
  ){
    //reference: https://axios-http.com/docs/api_intro
    let result = null
    let progressnum = 0

    // if(callback === null) debug = true
    if( debug === true ){ 
      console.log('APIHarnessApi.axios():', method, url )
      console.log('debug:', debug )
      console.log('data:', data )
    }
   
    let hdrs = null
    let form = null
    method = method.toLowerCase()
    if(method !== 'get' && data !== null ){
      let json = ( headers != null && -1 != headers.findIndex( (itm ) => itm.indexOf('application/json') ))
      if( json ){   // sending json data
        form = data  // data is an object
        if( debug ) console.log('Form data:', data )
      }
      else{   // sending form data
        const FormData = require('form-data')
        form = new FormData()
        Object.keys( data ).forEach( key => {
          form.append( key, data[key] )
        })
        hdrs = form.getHeaders()    // standard object
      }
    }
    if( headers !== null){
      if( hdrs === null ) hdrs = {}
      headers.forEach( line => {
        if( line.trim() === '' ) return
        if( hdrs === undefined) hdrs = new Headers()
        let vals = line.split( ':' )
        if( vals[1] === undefined || vals[1].trim() === '' ) return
        // hdrs.append( vals[0].trim(), vals[1].trim() )
        hdrs[ vals[0].trim()] = vals[1].trim()
      })
    }
    await axios({
      baseURL: url,
      method: method,   // get, post, put
      data: (method === 'get' ?null :form),
      params: (method === 'get' ?data :null),
      headers: hdrs,
      decompress: false,    // - Node only (XHR cannot turn off decompression)
      responseType: 'text',
      timeout: 5000,
      onDownloadProgress: function (progressEvent) {
        ++progressnum
        if( callback !== null )
          callback( 'progress', progressEvent, callbackData, progressnum)
      }
    } )
    .then( function( response ){
      if( debug === true ) {
        console.log('Status:', response.status, response.statusText, response.headers['content-length']+' bytes', typeof response.data)
      }
      result = response.data
      if( callback !== null )
        callback( 'response', response, callbackData)
    })
    .catch(function (error) {
      console.error('Axios error caught:')
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let response = error.response
        result = response.data
        console.error( response.data)
        console.error('...Status:', response.status, response.statusText )
        console.log('...Response headers:', response.headers)
      // } else 
      // if (error.request) {
      //   // The request was made but no response was received
      //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //   // http.ClientRequest in node.js
      //   console.log('...Request:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('...Unknown error:', error.message);
        result = '...Unknown error: ' +error
        console.log( result )
      }
      // console.error('...Config:', error.config )
      if( callback !== null )
        callback( 'error', error)
    })
    return result
  }

}

exports.db = new db()
