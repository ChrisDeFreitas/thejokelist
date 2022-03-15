/*
  test.js
  by Chris DeFreitas

  reference:
    https://www.netlify.com/docs/functions/#the-handler-method  

  testing:
  0. set env vars
    netlify env:set DBHUBapikey nnn
    netlify env:set DBHUBdbowner nnn

  1. run function server ( one of ):
    $ BROWSER=none netlify dev -d public --debug
    $ netlify dev -d public --debug
    $ netlify functions:serve

  2. call test server from console
    $ netlify functions:invoke test
    $ netlify functions:invoke next --querystring id=22
    $ netlify functions:invoke prior --payload "{\"id\":22}"

  3. call test server from browser
    http://127.0.0.1:8888/.netlify/functions/test
    http://127.0.0.1:8888/.netlify/functions/next?id=33

*/

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
}
