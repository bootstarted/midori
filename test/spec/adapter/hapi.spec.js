import { request, expect } from 'chai';
import { Server } from 'hapi';
import base from '../../../src/base';
import connector from '../../../src/adapter/hapi';

const createMiddleware = base();
const errorMiddleware = ({ error }) => {
  return {
    request: (req, res) => error(new Error(), req, res),
  };
};

describe('hapi', () => {
  let server;

  describe('normal', () => {
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

  describe('errors', () => {
    beforeEach(done => {
      server = new Server();
      server.connection({ host: 'localhost', port: 0, compression: false });
      server.ext(connector(errorMiddleware));
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
        expect(res).to.have.status(500);
      });
    });
  });
});
