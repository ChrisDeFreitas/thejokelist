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
  axios: async function(    // for server calls
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
   
    let result = null
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
    
    await axios({
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
  
  // utility functions
  bytesToStr:function(bytes){
    if( typeof bytes === 'string') bytes = Number( bytes )
    
		if(bytes < 1024) return bytes+' bytes'
		if(bytes < (1024 *1024)) return (Math.round(bytes /1024*100) /100)+' KB'
		if(bytes < (1024 *1024 *1024)) return (Math.round(bytes /1024/1024*100) /100)+' MB'
		return (Math.round(bytes /1024/1024/1024 *100) /100)+' GB'
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
