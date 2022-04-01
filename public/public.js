/*
  public.js
  by Chris DeFreitas
  - public Javascript functions for The Joke List web page: index.html

*/
var srvtype = null
var appserver = null
var joke = null // last joke return from server

window.onload = () => {
  appserver = document.URL 
  if( appserver.indexOf( 'netlify') > 0 
   || appserver.indexOf( ':8888') > 0 ){
    srvtype = 'netlify'
    appserver += '.netlify/functions/'
  }
  else{
    srvtype = 'graphql'
    appserver += 'graphql/'
  }
  console.log('appserver:', appserver)
  random()
}

function newJoke( jokePacket ){
  if( srvtype === 'graphql' ){
    let keys = Object.keys( jokePacket )
    let tmp = jokePacket[ keys[0] ]   // keys[0] === oneOf( last, next, random )
    if( tmp === null) {
      alert('A joke was not retrieved from server.\n Try a random joke by clicking "?".')
      return // error
    }
    joke = tmp
  }
  else{     // srvtype = 'netlify'
    joke = jokePacket
  }
  let title = ( joke.title === null ? 'Untitled' :joke.title.trim() )
  // @ts-ignore
  document.querySelector('#title').innerText = `#${joke.id}. ${title}`
  // @ts-ignore
  document.querySelector('#body').innerText = joke.body.trim()
}
function last(){
  let query = ( srvtype === 'graphql'
    ? `{ prior( id:${joke.id} ) { id, title, body }}`
    : `prior?id=${joke.id}`
  )
  load( query )
}
function next(){
  let query = ( srvtype === 'graphql'
    ? `{ next( id:${joke.id} ) { id, title, body }}`
    : `next?id=${joke.id}`
  )
  load( query )
}
function random(){
  let query = ( srvtype === 'graphql'
    ? `{ random { id, title, body }}`
    : `random`
  )
  load( query )
}
function load( query ){
  // http://localhost:4000/graphql/?query={%20random%20{%20id,%20title,%20body%20}}
  // http://127.0.0.1:8888/.netlify/functions/next?id=33
  
  let url = ( srvtype === 'graphql'
  ? appserver +'?query=' +query
  : appserver +query
  )
  // console.log('query:', url)

  fetch( url, { method: 'GET', })
  .then(response => {
    // console.log('response', response)
    return  response.json()
  })
  .then( result => {
    if( typeof result==='object' && result.title !== undefined ){ //netlify
      newJoke( result )
    } else 
    if( result.data ){    // graphql
      // console.log( 'result', result.data )
      newJoke( result.data )
    }
    else {
      if( typeof result === 'object') result = JSON.stringify( result )
      throw new Error( result )
    }
  })
  .catch( error => {
    alert('Error in Fetch request: \n' +error )
  })
}
