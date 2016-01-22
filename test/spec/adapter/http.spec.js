import { request, expect } from 'chai';
import { createServer } from 'http';
import base from '../../../src/base';
import connect from '../../../src/adapter/http';

const createMiddleware = base();

describe('http', () => {
  // Create a server with a host and port
  let server;

  beforeEach(done => {
    server = createServer();
    connect(createMiddleware({
      request: (req, res) => res.end(),
    }), server).listen(done);
  });

  afterEach(done => {
    server.close(done);
    server = null;
  });

  it('should return a result', () => {
    return request(server).get('/').then(res => {
      expect(res).to.have.status(200);
    });
  });
});
