import { request, expect } from 'chai';
import { Server } from 'hapi';
import base from '../../../src/base';
import connector from '../../../src/adapter/hapi';

const createMiddleware = base();

describe('hapi', () => {
  let server;

  beforeEach(done => {
    server = new Server();
    server.connection({ host: 'localhost', port: 0, compression: false });
    server.ext(connector(createMiddleware));
    server.address = () => server.info;
    server.route({
      method: 'GET',
      path: '/',
      handler(request, reply) {
        reply('Hello, world!');
      },
    });
    server.start(done);
  });

  afterEach(done => {
    server.stop(done);
  });

  it('should return a result', () => {
    return request(server).get('/').then(res => {
      expect(res).to.have.status(200);
    });
  });
});
