# midori

Minimalist, composable http apps for [http]/[express]/[hapi].

![build status](http://img.shields.io/travis/metalabdesign/midori/master.svg?style=flat)
![coverage](https://img.shields.io/codecov/c/github/metalabdesign/midori/master.svg?style=flat)
![license](http://img.shields.io/npm/l/midori.svg?style=flat)
![version](http://img.shields.io/npm/v/midori.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/midori.svg?style=flat)

## Usage

Install `midori` and add it to your `package.json` file:

```sh
npm install --save midori
```

These middleware components are NOT the same as express middleware; they are conceptually designed in a manner more similar to redux stores. Every middleware is an object with properties corresponding to events on an `http.Server` object; e.g. `request`, `error`, `upgrade`, etc. Each middleware function takes an existing middleware object and composes it.

For example, adding a `req.message` field:

```javascript
function addMessage(message) {
  // Take in the existing middleware here
  return (middleware) => {
    const { request } = middleware;
    // Return a new middleware here.
    return {
      ...middleware,
      request(req, res) {
        req.message = message;
        // Composition!
        request(req, res);
      },
    };
  };
}

// Create the composed middleware.
const app = addMessage('hello')({
  // Your "base" middleware.
  request(req, res) {
    res.statusCode = 200;
    res.end(`Message: ${req.message}`);
  }
});

// Create the server and use the appropriate methods on the middleware object.
const server = http.createServer();
server.on('request', app.request);
server.listen();
```

In that sense http middleware is even less opinionated than [express] middleware. It is merely a composition mechanism for a previously non-composable set of functions (http server events).

### With `http`

```javascript
import http from 'http';
import connect from 'midori/connect';
import empty from 'midori/empty';

const server = http.createServer();
const createApp = empty;
const app = createApp({
  request(req, res) {
    res.statusCode = 200;
    res.end(`Hello ${req.id}`);
  },
  error(err) {
    console.log('GOT ERROR', err);
  },
});

connect(app, server).listen(8080);
```

### With `express`

```javascript
import express from 'express';
import connector from 'midori-express';
import empty from 'midori/empty';

const createMiddleware = empty();
const app = express();

app.use(connector(createMiddleware));
app.listen(8080);
```

### With `hapi`

```javascript
import {Server} from 'hapi';
import connector from 'midori-hapi';
import empty from 'midori/empty';

const createMiddleware = empty();
const server = new Server();

server.connection({port: 8080});
server.ext(connector(createMiddleware));
server.start();
```

[midori-hapi]: https://github.com/metalabdesign/midori-hapi
[midori-express]: https://github.com/metalabdesign/midori-express
[http]: https://nodejs.org/api/http.html
[hapi]: http://hapijs.com/
[express]: http://expressjs.com/
[react]: https://facebook.github.io/react/
[redux]: https://github.com/rackt/redux
[webpack]: https://webpack.github.io/
