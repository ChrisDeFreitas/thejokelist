/*
  public.js
  by Chris DeFreitas
  - public Javascript functions for The Joke List web page: index.html

  requires;
  - sendto.js, post messages to social media
  
*/
var srvtype = null
var appserver = null
var joke = null // last joke return from server
let log = console.log

window.onload = () => {
  appserver = document.location.origin +'/'
  if( appserver.indexOf( 'netlify') > 0 
   || appserver.indexOf( ':8888') > 0 ){
    srvtype = 'netlify'
    appserver += '.netlify/functions/'
  }
  else{
    srvtype = 'graphql'
    appserver += 'graphql/'
  }
  log('appserver:', appserver)
  random()
  // @ts-ignore
  sendto.init()
}

function sendJoke( to ){
 let url = 'https://thejokelist.netlify.app/'
  let title = 'A Joke From TheJokeList'
  let body = ( joke.title === null ? 'Untitled' :joke.title )
           + '\n\n'
           + joke.body
           + '\n\n\n' //<br><br><br>'
           + 'From: ' +url
           
  if( to === 'whatsapp' ){
    // @ts-ignore
    sendto.whatsapp( body )
  }else
  if( to === 'email' ){
    // @ts-ignore
    sendto.email( title, body )
  }else
  if( to === 'facebook' ){
    // @ts-ignore
    sendto.facebook( url, body )
  }else
  if( to === 'linkedin' ){
    // @ts-ignore
    sendto.linkedin( url, title, body )
  }else
  if( to === 'twitter' ){
    // @ts-ignore
    sendto.twitter( body )
  }else
    alert( `sendJoke() error, bad arg: [${to}].` )
    
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
  // log('query:', url)

  fetch( url, { method: 'GET', })
  .then(response => {
    // log('response', response)
    return  response.json()
  })
  .then( result => {
    if( typeof result==='object' && result.title !== undefined ){ //netlify
      newJoke( result )
    } else 
    if( result.data ){    // graphql
      // log( 'result', result.data )
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
