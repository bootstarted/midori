import { request, expect } from 'chai';
import http from 'http';
import express from 'express';
import base from '../../../src/base';
import connector from '../../../src/adapter/express';

const createMiddleware = base();

describe('express', () => {
  let app;
  let server;

  beforeEach(done => {
    app = express();
    app.use(connector(createMiddleware));
    app.get('/', (req, res) => res.status(200).send());
    server = http.createServer(app);
    server.listen(done);
  });

  afterEach(done => {
    server.close(done);
    app = null;
    server = null;
  });

  it('should return a result', () => {
    return request(server).get('/').then(res => {
      expect(res).to.have.status(200);
    });
  });
});
