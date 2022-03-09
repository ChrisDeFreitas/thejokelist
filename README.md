# The Joke List

As I was building [API-Harness](https://github.com/ChrisDeFreitas/API-Harness) I tested free and paid Joke API’s with unsatisfactory results. So I thought it would be a good idea to provide a free Joke API for the Pandemic.  For motivation I dug into GraphQL and Sequelize as they look like promising technologies.  

In general, I abstain from ORMs because I am very comfortable in the SQL world—the database is my data dictionary. Sequelize worked well building this simple database. But I would look at a tool to automate creating schemas in any app with a more complex data model. I was excited about GraphQL’s promise of a query language for API’s. But for a project this small it’s overkill. I’m sure it would shine in a large corporate environment. But, the projects I build would be better supported if it standardized request/response logging and tracking, which is what I was expecting. The JSON data exchange is very simple but unintuitive to implement, and verbose (why can’t Query be automatically derived from Root?).

## Features

- A simple GraphQL API with Sequelize backend to deliver jokes.  

- Contains a SQLite database of jokes, jokelist.sqlite. The ~100 row database is significantly smaller the 200K JSON dataset because it’s filtered so my Mom can use the website. Will add more jokes over time.

## Technical Notes

- The data is parsed from the JSON datafiles at [joke-dataset](https://github.com/taivop/joke-dataset).

- Created simple app to review JSON jokes and add them to the database: db/import/review.js

- Created simple app to import jokes based on data length and rating: db/import/import.js. Resulting database contains 99 records, but the content is not filtered.

## Thanks To

- [GraphQL](https://graphql.org)

- [GraphQL HTTP Server Middleware](https://github.com/graphql/express-graphql)

- [joke-dataset](https://github.com/taivop/joke-dataset)

 

## ToDo

- finish configuring repository

- clean up code and add to repository

- finish Netlify hosting, test

- update readme with web app URL

- add API endpoint usage examples
