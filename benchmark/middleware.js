var compose = require('lodash/flowRight');
var http = require('http');
var send = require('../middleware/send').default;
var connect = require('../adapter/http').default;

var app = send('Hello World');
var noop = function(app) {
  return {
    request(req, res) {
      app.request(req, res);
    },
  };
};

// number of middleware
var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
  app = compose(noop, app);
}

connect(app(), http.createServer()).listen(3333);
