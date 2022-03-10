# The Joke List

As I was building [API-Harness](https://github.com/ChrisDeFreitas/API-Harness) I tested free and paid Joke API’s with unsatisfactory results. So I thought it would be a good idea to provide a free Joke API for the Pandemic.  For motivation I dug into GraphQL and Sequelize as they look like promising technologies.  

## Features
- A simple GraphQL API with Sequelize backend to deliver jokes.  
- Contains a SQLite database of jokes, jokelist.sqlite. The ~100 row database is significantly smaller than the 200K JSON dataset because it’s filtered so my Mom can use the website. Will add more jokes over time.

## Technical Notes
- Jokes obtained from the JSON datafiles at [joke-dataset](https://github.com/taivop/joke-dataset).  Files included in folder: db/import/
- Created simple app to view JSON jokes and add them to the database: db/import/review.js
- Created simple app to automatically import jokes based on data length and rating: db/import/import.js. Resulting database contains 99 records, but the content is not filtered.
- Sample console request with curl:
```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ test }"}' \
http://localhost:4000/graphql
```

## Thanks To
- [Axios HTTP client](https://axios-http.com/)
- [Chai a BDD/TDD assertion library](https://www.chaijs.com/)
- [Express web application framework](https://expressjs.com/)
- [express-graphql HTTP Server Middleware](https://github.com/graphql/express-graphql)
- [GraphQL query language for APIs](https://graphql.org)
- [Icon from the Noun Project global visual language](https://thenounproject.com/icon/playful-2546421/)
- [joke-dataset of English plaintext jokes](https://github.com/taivop/joke-dataset)
- [Mocha test framework](https://mochajs.org/)
- [Morgan HTTP request logger middleware](https://www.npmjs.com/package/morgan)
- [Node.js](https://nodejs.org/en/)
- [PM2 daemon process manager](https://www.npmjs.com/package/pm2)
- [Prompts, CLI prompts to enquire users for information](https://www.npmjs.com/package/prompts)
- [Sass CSS extension language](https://sass-lang.com)
- [Sequelize ORM](https://sequelize.org/)
- [SQLite database engine](https://www.sqlite.org)
- [vscode-live-sass-compiler](https://github.com/ritwickdey/vscode-live-sass-compiler)

## ToDo
- finish configuring repository
- clean up code and add to repository
- finish Netlify hosting, testing
- update readme with web app URL
- add API endpoint usage examples to readme
