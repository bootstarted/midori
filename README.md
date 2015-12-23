# http-middleware-metalab

Minimalist http middleware for server-side node projects.

## Usage

Install `http-middleware-metalab` and add it to your `package.json` file:

```sh
npm install --save http-middleware-metalab
```

### With `http`

```javascript
import compose from 'lodash/function/compose';
import http from 'http';

import base from 'http-middleware-metalab/base';
import webpack from 'http-middleware-metalab/webpack';

const app = (req, res) => {
  res.statusCode = 200;
  res.end('Hello World.');
}

const listener = compose(
  base,
  webpack
)(app);

const server = http.createServer(listener);
server.listen(8080);
```

### With `express`


```javascript
import compose from 'lodash/function/compose';
import express from 'express';

import base from 'http-middleware-metalab/base';
import webpack from 'http-middleware-metalab/webpack';

const middleware = compose(

)(app);

const app = express();
app.use(middleware);

app.listen(8080);
```

### With `hapi`

```javascript
import compose from 'lodash/function/compose';
import { Server } from 'hapi';

import base from 'http-middleware-metalab/base';
import webpack from 'http-middleware-metalab/webpack';

const server = new Server();

server.connection({ port: 80 });
server.ext({
    type: 'onRequest',
    method: function ({ raw }, reply) {

        middleware(raw.req, raw.res)
        return reply.continue();
    }
});
```
