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
import {get, send} from 'midori';

const createApp = get('/', send('Hello world.'));
const app = createApp();

app.listen(8081, () => {
  console.log('Example `midori` app started.');
});
```

There are plenty of other examples available.

## Overview

At its core a `midori` app is just a plain object that has functions for handling HTTP server events:

```javascript
const baseApp = {
  request: (req, res) => {
    // Handler for httpServer.on('request')
    // ...
  },
  error: (err, req, res) => {
    // Handler for httpServer.on('error')
    // ...
  },
  // ...
}
```

However, the power of `midori` comes from its ability to compose apps together effortlessly, and create complex applications and behaviors out of simple fragments.  The base compositional functionality in `midori` comes from composing app creators – functions that take as input an app object and give as output a new app object.

```javascript
import {request, next} from 'midori';

const createApp = request((req, res) => {
  res.statusCode = 200;
  return next; // Continue to the next item in the chain.
});

// Takes as input an existing app, returns as output a new app.
const app = createApp(baseApp);
```

Because of this pattern apps can be easily chained together using `compose`:

```javascript
import {compose, request, next, pure} from 'midori';

const createApp = compose(
  request((req, res) => {
    res.statusCode = 200;
    return next; // Continue to the next item in the chain.
  }),
  request((req, res) => {
    res.end(`Hello world.`);
    return pure(); // Halt processing.
  }),
);

const app = createApp();
```

You can also write your own app creators manually, but it's not recommended because it often comes with pitfalls that you would otherwise avoid by using the built-in functions available to you.

```javascript
import {compose, request, next, pure} from 'midori';

const createApp = compose(
  request((req, res) => {
    res.statusCode = 200;
    return next; // Continue to the next item in the chain.
  }),
  (app) => {
    // Take the parent app and return a new app with a modified request handler
    // that calls the parent app.
    return {
      ...app,
      request(req, res) {
        // You have to handle errors in here and everything else manually.
        console.log('Hello!');
        return app.request(req, res);
      },
    };
  },
);

const app = createApp();
```

The `request` function is roughly equivalent to a monadic `bind` and you can use it to return new app creators that will create the next app `midori` will run for you. If you wish to halt the chain you can use `pure` to return a static value, or if you wish to use the next app provided to you then you can just pass `next` which is the identity function.

```javascript
import {get, send, compose} from 'midori';

// This is an app creator;
const sendGreeting = (name) => send(`Hello ${name}.`);

// You could write something like the following:
// const app = sendGreeting();

// But instead we will re-use it elsewhere:
const createApp = compose(
  get('/hello/:name', request((req, res) => {
    // You return an app creator from `request` and in that way you can chain
    // apps together too.
    return sendGreeting(req.params.name);
  })),
  // You can of course still use them as part of all the other functions that
  // expect app creators as well.
  get('/test', sendGreeting('World'))
);

const app = createApp();
```

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

const createApp = compose(
  match(isGetFoo, send('Hello from foo')),
);
```

You can also take action based on when the match fails:

```javascript
import {match, send, compose} from 'midori';
import {path, host} from 'midori/match';

const isFoo = path('/foo'); // Match against URL path
const isLocalhost = host(/localhost/); // Match against `Host` header

const createApp = compose(
  match(isFoo, send('Hello from foo'), send('Hello not from foo')),
);
```

## Async

Many `midori` functions (including `request` and `error`) understand how to handle promises and async functions.

Using `Promise`:

```javascript
import {send, request} from 'midori';

const getData = () => Promise.resolve(50);

const createApp = request((req, res) => {
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

const createApp = request(async (req, res) => {
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
import {request, error, compose, pure} from 'midori';

const createApp = compose(
  request((req, res) => {
    // Can also `return Promise.reject();`
    throw new Error('Help!');
  }),
  error((err, req, res) => {
    res.end(`I caught an error.`);
    return pure();
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

const baseApp = request((req, res) => {
  res.setHeader('Content-Type', 'test');
  return next;
});

it('should set the header', () => {
  return fetch(baseApp, '/').then((res) => {
    assert(res.headers['content-type'] === 'test');
  });
});
```

Using a real HTTP server:

```javascript
import {request, pure} from 'midori';
import fetch from 'node-fetch';

// Reference to HTTP server instance used in each test.
let server;
let url;

const baseApp = request((req, res) => {
  res.end('Hello world');
  return pure();
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

const createApp = send('Hello world.');
```

### With `http`

Support for node's `http` server comes in the box.

```javascript
import http from 'http';
import {connect} from 'midori';

const server = http.createServer();

connect(createApp(), server).listen(8080);
```

### With `express`

Install dependencies:

```sh
npm install --save midori-express express
```

Create an `express` app and just `use()` your midori middleware as if it were `express` middleware:

```javascript
import express from 'express';
import connector from 'midori-express';
import {compose} from 'midori';

const app = express();
const createMiddleware = compose(
  connector,
  createApp,
);

app.use(createMiddleware());
app.listen(8080);
```

### With `hapi`

Install dependencies:

```sh
npm install --save midori-hapi hapi
```

Create a `hapi` app and register your midori middleware as an extension:

```javascript
import {Server} from 'hapi';
import connector from 'midori-hapi';
import {compose} from 'midori';

const server = new Server();
const createExt = compose(
  connector,
  createMiddleware,
);

server.connection({port: 8080});
server.ext(createExt());
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
