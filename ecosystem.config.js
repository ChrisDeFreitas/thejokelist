module.exports = {
  apps : [{
    name   : "JokeListApi",
    script : "./server.js",
    watch  : ["./server.js", "./lib/*.js"]
  }]
}
