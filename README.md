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

```javascript
import {apply, query, url, send} from 'midori';

const app = apply(query, url, (query, {pathname}) => {
  return send(`${pathname} - got ${query.foo}`);
})
```

There are plenty of other examples available in the [./examples] folder.


## Async

Many `midori` functions (including `request` and `error`) understand how to handle promises and async functions.

Using `Promise`:

```javascript
import {send, request} from 'midori';

const getData = () => Promise.resolve(50);

const app = request(() => {
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

const app = request(async () => {
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
  request(() => {
    // Can also `return Promise.reject();`
    throw new Error('Help!');
  }),
  error((err) => {
    console.log(`I caught an error.`);
    return halt;
  }),
);
```

If you need access to the request/response during error handling you can use those functions:

```javascript
import {request, error, compose} from 'midori';

const app = compose(
  request(() => {
    // Can also `return Promise.reject();`
    throw new Error('Help!');
  }),
  error((err) => {
    return request((req) => {
      console.log('There was an error at:', req.url);
      throw err;
    });
  }),
);
```

## Testing

### Testing Apps

`midori` includes a dedicated `fetch()` utility for testing apps:

```javascript
import {response, next} from 'midori';
import {fetch} from 'midori/test';

const app = response((res) => {
  res.setHeader('Content-Type', 'test');
  return next;
});

it('should set the header', () => {
  return fetch(app, '/').then((res) => {
    assert(res.headers['content-type'] === 'test');
  });
});
```

But you can use a real HTTP server too:

```javascript
import {response, listen, halt} from 'midori';
import fetch from 'node-fetch';

// Reference to HTTP server instance used in each test.
let server;
let url;

const app = response((res) => {
  res.end('Hello world');
  return halt;
});

beforeEach(done => {
  // Spin up a server and connect your app to it.
  server = listen(app, () => {
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

### Testing Selectors

You can use `runSelector` and `getSelectorImplementation` to test selectors in isolation.

```js
import {createSelector} from 'midori';
import {runSelector, getSelectorImplementation} from 'midori/test';

import mySelectorA from './mySelectorA';
import mySelectorB from './mySelectorB';

jest.mock('./mySelectorA', () => createSelector(jest.fn()));
jest.mock('./mySelectorB', () => createSelector(jest.fn()));

const mySelectorC = createSelector(
  mySelectorA,
  mySelectorB,
  (a, b) => a + b,
);


getSelectorImplementation(selectorA).mockImplementation(() => 1);
getSelectorImplementation(selectorB).mockImplementation(() => 1);

const result = runSelector(mySelectorC);
expect(result).toBe(2);
```

To mock `request` or other midori internal selectors you can:

```js
import {request} from 'midori';
import {createMockRequest} from 'midori/test';

jest.mock('midori/request', () => {
  return createSelector(jest.fn(() => {
    return createMockRequest({
      url: '/foo',
      method: 'POST',
    });
  }));
});
```

If you're not using `jest` or just want to mock values for a single test, then `runSelector` also provides a factory function with which you can use to setup your mocks.

```js
import {createSelector} from 'midori';
import {runSelector} from 'midori/test';

import mySelectorA from './mySelectorA';
import mySelectorB from './mySelectorB';

const mySelectorC = createSelector(
  mySelectorA,
  mySelectorB,
  (a, b) => a + b,
);

const result = runSelector(mySelectorC, (inst) => {
  inst.mockValue(mySelectorA, 1);
  inst.mockValue(mySelectorB, 1);
});
expect(result).toBe(2);
```

## Advanced

### Routing

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

You can also create match conjunctions using `every` (i.e. all predicates must be true for the match to succeed).

```javascript
import {match, send, compose} from 'midori';
import {path, method, every} from 'midori/match';

// This is roughly how `get()` works internally.
const isGetFoo = every(method('GET'), path('/foo'));

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

### Connectors

You can connect `midori` to a number of other HTTP frameworks (like [express], [hapi]).

```javascript
import {send} from 'midori';

const app = send('Hello world.');
```

#### With `express`

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

#### With `hapi`

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
