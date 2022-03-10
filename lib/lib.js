/*
  lib.js  
  - by Chris DeFreitas, ChrisDeFreitas777@gmail.com
  API Harness shared code

  objects:

  uobj = {    //url object
    url
    protocol
    username
    host
    path
    port
    query
    hash
  }
  
*/
'use strict';

var q = {
  axios: function(    // for server calls
    method,   // get, post, put
    url = '', 
    data = null,
  //  signal = null,  //abortController.signal
    debug = false,
    callbackData = null,   // returned to callback
    callback = null, 
  ){
    //reference: https://axios-http.com/docs/
    const axios = require('axios').default
    let progressnum = 0

    if(callback === null) debug = true
//    if(data === null) data = {}
    if( debug === true ){ 
      console.log('lib.axios():', method, url )
      console.log('debug:', debug )
      console.log('data:', data )
    }
   
    let headers = null
    let form = null
    if(method !== 'get' && data !== null ){
      const FormData = require('form-data')
      form = new FormData()
      Object.keys( data ).forEach( key => {
        form.append( key, data[key] )
      })
      headers = form.getHeaders()
    }
    
    axios({
      baseURL: url,
      method: method,   // get, post, put
      data: (method === 'get' ?null :form),
      params: (method === 'get' ?data :null),
      headers: headers,
      decompress: false,
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
      if( callback !== null )
        callback( 'response', response, callbackData)
    })
    .catch(function (error) {
      console.error('Axios error caught:')
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let response = error.response
        console.error( response.data)
        console.error('...Status:', response.status, response.statusText )
        console.log('...Response headers:', response.headers)
      } else 
      if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('...Request:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('...Unknown error:', error.message);
      }
      console.error('...Config:', error.config )
      if( callback !== null )
        callback( 'error', error)
    })
  },  
  fetch(    //for browser, supported by HTML5 DOM
    url = '', 
    signal = null,         // AbortController.signal
    callback = null,       // callback( type=error/response/progress, Response||TypeError/Response/{ num, ms, current, total } ) 
    headers = null,        // [ 'xxx=yyy', ... ]
    debug = false          // true === write status to console
  ){
    if(callback === null) debug = true

    if( debug ){
 //     console.log( 'Fetch Metod:', method )
      console.log( 'Fetch URL:', url )
      console.log( 'Fetch Request Headers:\n', headers )
    }
    
    let hdrs = null
    if(debug && headers != null && headers.length > 0){
      headers.forEach( line => {
        if( line.trim() === '' ) return
        if( hdrs === null) hdrs = new Headers()
        let vals = line.split( ':' )
        hdrs.append( vals[0].trim(), vals[1].trim() )
      })
    }

    const init = {
      method: 'GET',
      body: null,
      cache: 'default',
      // credentials
      // headers: hdrs,
      // integrity
      // keepalive
      mode: 'cors',
      redirect: 'follow',
      // referrer
      signal: signal
    }
    if( hdrs !== null ) init.headers = hdrs   //error if init.headers === null

    let _start = performance.now()
    let response = null
    let contentLength = 0
    
    async function readData () {        
      // https://javascript.info/fetch-progress
      let progressNum = 0
      let receivedLength = 0
      let chunks = []
      const reader = response.body.getReader()
      while(true) { // infinite loop while the body is downloading
        const { done, value } = await reader.read()     // done is true for the last chunk; value is Uint8Array of the chunk bytes
        if( done ) break
        chunks.push(value);
        receivedLength += value.length    // bytes
        if( callback )
          callback( 'progress', { num:++progressNum, ms:(performance.now() -_start), current:receivedLength, total:contentLength } )
      }
      let chunksAll = new Uint8Array(receivedLength); // concatenate chunks into single Uint8Array
      let position = 0;
      for(let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
      }
      let result = new TextDecoder("utf-8").decode(chunksAll);
      response.dataLength = receivedLength    // simplify data handling
      return result
    }

    fetch( url, init )  // connect
    .then( resp => {    // handle error or data
      response = resp
      if( debug ){
        console.log( 'Fetch Response:\n', resp )
        console.log( `Fetch Response Headers:` )
        let idx = 0
        resp.headers.forEach(( value, key ) => {
          console.log( '#'+(++idx), key, value )
        })
      }

      if( !resp.ok )
        return null
      // return resp.text()   //default without progress info
      if( resp.headers.has('Content-Length') )
        contentLength = Number( resp.headers.get('Content-Length') )
      return readData()
    })
    .then( data => {    // return response to caller
      if( !response.ok ) {
        console.log( 'Fetch HTTP error:', response.status, response.statusText );
        if( callback )
          callback( 'error', response, debug )
      }
      else{
        response.data = data
        if( callback )
          callback( 'response', response, debug )
      }
      if( debug )
        console.log( 'Fetch duration:', ( performance.now() -_start) +'ms' )
    })
    .catch( error => {
      console.log( 'Fetch error caught:', error, response)
      if( callback )
        callback( 'error', error, debug )
    })  
  },
  
  //
  url:{
    // references:
    // https://en.wikipedia.org/wiki/URL
    // https://developer.mozilla.org/en-US/docs/Web/API/URL
    host: function( str ){
      const url = new URL( str )
      return url.hostname
    },
    join: function( uobj, qList = null ){    // return a valid url 
      function test( key, pre, post ){
        if( uobj[key] !== undefined && uobj[key] !== '')
          return pre +uobj[key] +post
        return ''
      }
      
      let url = test('protocol', '',  ':')
      
      if( uobj.user || uobj.host || uobj.port ) url += '//'
      url += test('user', '',  '@')
      url += test('host', '',  '')
      url += test('port', ':', '')
      
      if( uobj.path && uobj.path[0] !== '/') url += '/'
      url += test('path', '', '')

      let str = ''
      if(qList === null){
        str = q.query.join( uobj.query )
      }else 
      if( qList.length !== 0 ) {
        str = q.query.join( qList )
      }
      if( str !== ''){
        if( str[0] !== '?' ) url += '?'
        url += str
      }

      url += test('hash',     '#', '')
      return url
    },
    obj: function(){
      return {
        url: '',
        protocol: '',
        username: '',
        // password: url.password,
        host:   '',
        port:   '',
        path:   '',
        query:  '',
        // qList:  [],
        hash: ''
      }
    },
    parse( str ){ //return a uobj
      str = str.trim()
      if( str === '' ) return q.url.obj()

      const url = new URL( str )
      let uobj = {
        url: str,
        protocol: url.protocol,
        username: url.username,
        // password: url.password,
        host:   url.hostname,
        port:   url.port,
        path:   url.pathname,
        query:  url.search,
        // qList:  [],
        hash:  url.hash
      }
      if( ':' === uobj.protocol[ url.protocol.length -1 ] )
        uobj.protocol = uobj.protocol.substring( 0 , uobj.protocol.length -1 )
      if( '/' === uobj.path[ 0 ] )
        uobj.path = uobj.path.substring( 1 )
      if( '?' === uobj.query[ 0 ] )
        uobj.query = uobj.query.substring( 1 )
      // uobj.qList = uobj.query.split('&')
      if( '#' === uobj.hash[ 0 ] )  uobj.hash = uobj.hash.substring( 1 )

      return uobj
    }
  },
  query: {
    join( list ){     // list may be a string; return encodeURI( list )
      if( list === undefined || list.length === 0 )
        return ''

      if( typeof list === 'string')
        return encodeURI( list )

      let str = encodeURI( list.join( '&' ))
      return str
    },
    parse: function( str ){   // return array of query parameters
      if( str === undefined || str === '')
        return []
      
      let result = []
      let searchParams = new URLSearchParams( str )
      searchParams.sort()
      searchParams.forEach( (value, key) => {
        result.push(key+'='+value);
      })
  
      return result
    }
  },

  // utility functions
  bytesToStr:function(bytes){
    if( typeof bytes === 'string') bytes = Number( bytes )
    
		if(bytes < 1024) return bytes+' bytes'
		if(bytes < (1024 *1024)) return (Math.round(bytes /1024*100) /100)+' KB'
		if(bytes < (1024 *1024 *1024)) return (Math.round(bytes /1024/1024*100) /100)+' MB'
		return (Math.round(bytes /1024/1024/1024 *100) /100)+' GB'
	},
  insertInList: function( oldList, pos, str ){ //duplicate list and insert new item at pos
    let list = oldList.slice()
    if( pos > list.length ) pos = list.length
    list.splice( pos, 0, str)
    return list
  },
  timeFormat: function(ms, format = 'ms' ) {
		if(format==='ms') return ms+'ms'
		if(format==='s') return (Math.round(ms/1000*10)/10)+'sec'			//99.9sec
		if(format==='m') return (Math.round(ms/1000/60*10)/10)+'min'		//99.9min
		if(format==='h') return (Math.round(ms/1000/60/60*100)/100)+'hrs'	//99.99hrs
		if(format==='d') return (Math.round(ms/1000/60/60/24*100)/100)+'days'	//99.99days
	},
};

module.exports = q  
