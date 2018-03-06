# midori

Minimalist, monadic, typed http apps for [http]/[express]/[hapi].

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

Test out your first app:

```javascript
import {get, send, listen} from 'midori';

const app = get('/', send('Hello world.'));

listen(app, 8081, () => {
  console.log('Example `midori` app started.');
});
```

There are plenty of other examples available.

## Routing

The standard way of doing request dependent routing is by using `match`. Most frameworks allow you to only match against the request path and method, but `midori` makes no such compromises and you can use all kinds of predicates to determine the control flow of your application.

```javascript
import {match, send, compose} from 'midori';
import {path, host} from 'midori/match';

const isFoo = path('/foo'); // Match against URL path
const isLocalhost = host(/localhost/); // Match against `Host` header

const createApp = compose(
  match(isFoo, send('Hello from foo')),
  match(isLocalhost, send('You accessed from localhost')),
);
```

You can also create match conjunctions using `compose` (i.e. all predicates must be true for the match to succeed).

```javascript
import {match, send, compose} from 'midori';
import {path, method} from 'midori/match';

// This is roughly how `get()` works internally.
const isGetFoo = compose(method('GET'), path('/foo'));

const app = compose(
  match(isGetFoo, send('Hello from foo')),
);
```

You can also take action based on when the match fails:

```javascript
import {match, send, compose} from 'midori';
import {path, host} from 'midori/match';

const isFoo = path('/foo'); // Match against URL path
const isLocalhost = host(/localhost/); // Match against `Host` header

const app = compose(
  match(isFoo, send('Hello from foo'), send('Hello not from foo')),
);
```

## Async

Many `midori` functions (including `request` and `error`) understand how to handle promises and async functions.

Using `Promise`:

```javascript
import {send, request} from 'midori';

const getData = () => Promise.resolve(50);

const app = request((req, res) => {
  return getData().then((result) => {
    if (result > 5) {
      return Promise.resolve(send('Yes.'));
    }
    return Promise.resolve(send('No.'));
  });
});
```

Using `async` / `await`:

```javascript
import {request, send} from 'midori';

const getData = () => Promise.resolve(50);

const app = request(async (req, res) => {
  const result = await getData();
  if (result > 5) {
    return send('Yes.');
  }
  return send('No.');
});
```

## Error Handling

Just as `request` provides a mechanism for dealing with request flow, `error` provides the same for handling errors.

```javascript
import {request, error, compose, halt} from 'midori';

const app = compose(
  request((req, res) => {
    // Can also `return Promise.reject();`
    throw new Error('Help!');
  }),
  error((err, req, res) => {
    res.end(`I caught an error.`);
    return halt;
  }),
);
```

## Debugging

Because `midori` can keep track of its middleware chain it's possible to see the exact sequence of steps in your request handling pipeline that brought you to where ended up – this is often many times more useful than a stack trace because of how async is handled in JavaScript.

## Testing

Since `midori` middleware is incredibly simple, there is nothing fancy required to test it. You can use either HTTP request/response mocks OR a simple HTTP server depending on your needs. Because the request chain is guaranteed to return something you can also use the result of your request handler. `midori` includes a dedicated `fetch()` utility for these purposes.

Using mocks:

```javascript
import {request, next} from 'midori';
import {fetch} from 'midori/test';

const app = request((req, res) => {
  res.setHeader('Content-Type', 'test');
  return next;
});

it('should set the header', () => {
  return fetch(app, '/').then((res) => {
    assert(res.headers['content-type'] === 'test');
  });
});
```

Using a real HTTP server:

```javascript
import {request, halt} from 'midori';
import fetch from 'node-fetch';

// Reference to HTTP server instance used in each test.
let server;
let url;

const baseApp = request((req, res) => {
  res.end('Hello world');
  return halt;
});

beforeEach(done => {
  // Spin up a server and connect your app to it.
  server = createApp().listen(() => {
    const {port} = server.address();
    url = `http://localhost:${port}`;
    done();
  });
});

afterEach(done => {
  // Shut down the server after each test.
  server.close(done);
  server = null;
  url = null;
});

it('should return a result', () => {
  return fetch(url).then((res) => {
    assert(res.statusCode === 200);
  });
});
```

## Connectors

You can connect `midori` to a number of other HTTP frameworks (like [express], [hapi], or none at all). The middleware creator below is used in all examples:

```javascript
import {send} from 'midori';

const app = send('Hello world.');
```

### With `http`

Support for node's `http` server comes in the box.

```javascript
import http from 'http';
import {connect} from 'midori';

const server = http.createServer();

connect(app, server);
server.listen(8080);
```

### With `express`

Install dependencies:

```sh
npm install --save midori-express express
```

Create an `express` app and just `use()` your midori middleware as if it were `express` middleware:

```javascript
import express from 'express';
import createMiddleware from 'midori-express';
import {compose} from 'midori';

const expressApp = express();

expressApp.use(createMiddleware(app));
expressApp.listen(8080);
```

### With `hapi`

Install dependencies:

```sh
npm install --save midori-hapi hapi
```

Create a `hapi` app and register your midori middleware as an extension:

```javascript
import {Server} from 'hapi';
import createExt from 'midori-hapi';

const server = new Server();

server.connection({port: 8080});
server.ext(createExt(app));
server.start();
```

## Migration & Middleware Compatibility

Coming from another framework? Prefer to write your middleware handlers like you do in those other frameworks? Not a problem.

### Express

The traditional callback style that [express] uses is compatible with `midori`. You can connect your [express] middleware as follows:

```javascript
import {middleware} from 'midori';

const createMiddleware = middleware((req, res, next) => {
  req.statusCode = 201;
  next();
});
```

Error handlers are also supported:

```javascript
import {middleware} from 'midori';

const createMiddleware = middleware((err, req, res, next) => {
  console.log('We got an error:', err);
  next(err);
});
```


[midori-hapi]: https://github.com/metalabdesign/midori-hapi
[midori-express]: https://github.com/metalabdesign/midori-express
[http]: https://nodejs.org/api/http.html
[hapi]: http://hapijs.com/
[express]: http://expressjs.com/
[react]: https://facebook.github.io/react/
[redux]: https://github.com/rackt/redux
[webpack]: https://webpack.github.io/
