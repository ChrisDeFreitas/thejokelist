# The Joke List

Doesn't every pandemic need some good jokes? 
- Check out: [The Joke List](http://thejokelist.netlify.com)

As I was building [API-Harness](https://github.com/ChrisDeFreitas/API-Harness) I tested many free Joke APIs with unsatisfactory results. So I thought it would be a good idea to provide a free Joke website and API for public consumption.

The jokes are from [a dataset of English plaintext jokes](https://github.com/taivop/joke-dataset) by Taivo Pungas, published in 2017.

My ulterior motive was to get some technology in place for coming projects. So there is a lot more tech here than required:  
- Sequelize, and SQLite for data management
- Prompts for console app development
- Express.js, GraphQL, Morgan, and PM2 for traditional web application development
- Netlify and DBHub.io for serverless public cloud deployment
- CI/CD: PM2, Netlify-cli, vscode-live-sass-compiler
- UI testing with Gherkin/Cucumber-js and selenium-webdriver

## Features
- public website and API: [thejokelist.netlify.com](thejokelist.netlify.com)
- deploy a local website and API with Express.js web server and GraphQL endpoints
- contains a SQLite database (db/jokelist.sqlite) with a ~100 row table of jokes. This is significantly smaller than the 200K JSON dataset because it’s filtered so my Mom can use the website. Will add more jokes over time.

### UI Feature Tests (in [Gherkin syntax](https://cucumber.io/docs/gherkin/))

```
Feature: Random Joke

  Scenario: Retrieve a random joke.
    Given the home page is displayed
    And  the Question Mark is clicked
    Then a new joke appears

Feature: Next Joke

  Scenario: Retrieve the next joke by joke.id.
    Given the home page is displayed
    And  the Right Arrow is clicked
    Then the next joke with an id larger than the last appears

Feature: Prior Joke

  Scenario: Retrieve the prior joke by joke.id.
    Given the home page is displayed
    And  the Left Arrow is clicked
    Then the next joke with an id smaller than the last appears
```

## Technical Notes

### Data
- Jokes from the JSON data files at [joke-dataset](https://github.com/taivop/joke-dataset).  Files included in folder: import/
- important: many jokes in the [joke-dataset](https://github.com/taivop/joke-dataset) are not suitable for a general audience
- import/import.js is an app to automatically import jokes based on data length and rating into import/import.sqlite. Resulting database contains 99 records, but the content is not suitable for a general audience
- import/review.js is an app to view JSON jokes and add them to import/review.sqlite 
- db/jokelist.sqlite created by copying import/review.sqlite
- DBHub.io database manually updated with db/jokelist.sqlite


### Public Netlify API 
- http://thejokelist.netlify.com/.netlify/functions/random
- http://thejokelist.netlify.com/.netlify/functions/next?id=22
- http://thejokelist.netlify.com/.netlify/functions/prior?id=22
- JSON returned:
```bash
{
  "id": 121,
  "title": "You know what they say about jokes",
  "body": "The cheesier the grater!"
}
```

### Private Express GraphQL API 
- http://localhost:4000/graphql?query={ random {id title body} }
- http://localhost:4000/graphql?query={ next( id: 20) {id title body} }
- http://localhost:4000/graphql?query={ prior( id: 20) {id title body} }
- console request with curl:
```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ random }"}' \
http://localhost:4000/graphql
```
- JSON returned:
```bash
{
  "data": {
    "random": {
      "id": 121,
      "title": "You know what they say about jokes",
      "body": "The cheesier the grater!"
    }
  }
}
```

## Thanks To
- [Axios HTTP client](https://axios-http.com/)
- [Chai a BDD/TDD assertion library](https://www.chaijs.com/)
- [cucumber-js automated tests in plain language, for Node.js](https://github.com/cucumber/cucumber-js)
- [DBHub.io cloud storage for SQLite databases](https://dbhub.io/)
- [Express web application framework](https://expressjs.com/)
- [express-graphql HTTP Server Middleware](https://github.com/graphql/express-graphql)
- [GraphQL query language for APIs](https://graphql.org)
- [joke-dataset of English plaintext jokes](https://github.com/taivop/joke-dataset)
- [Mocha test framework](https://mochajs.org/)
- [Morgan HTTP request logger middleware](https://www.npmjs.com/package/morgan)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [Netlify web development platform](https://www.netlify.com/)
- [Node.js](https://nodejs.org/en/)
- [PM2 daemon process manager](https://www.npmjs.com/package/pm2)
- [Prompts, CLI prompts to enquire users for information](https://www.npmjs.com/package/prompts)
- [Sass CSS extension language](https://sass-lang.com)
- [Selenium-webdriver browser automation library](https://www.npmjs.com/package/selenium-webdriver)
- [Sequelize ORM](https://sequelize.org/)
- [SQLite database engine](https://www.sqlite.org)
- [SVG icon from the Noun Project global visual language](https://thenounproject.com/icon/playful-2546421/)
- [vscode-live-sass-compiler](https://github.com/ritwickdey/vscode-live-sass-compiler)

## Updates
20220329
- implemented UI testing with cucumber.js and selenium webdriver
- updated index.html to work localy (GraphQL) and remotely (Netlify)


## ToDo
- return same JSON structure from Express and Netlify
- finish Netlify testing
- replace Mocha/Chai with Cucumber-js
