/*
  server.js
  by Chris DeFreitas
 
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ hello }"}' \
http://localhost:4000/graphql


*/

var express = require('express')
var { graphqlHTTP } = require('express-graphql')
var morgan = require('morgan')
var serveStatic = require('serve-static')

const { schema, root }  = require('./lib/graphql.schema' )

var app = express()
app.use(morgan('combined'))
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))
app.use(express.static('public', { fallthrough:true }))

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
 