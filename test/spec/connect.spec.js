import {request, expect} from 'chai';
import sinon from 'sinon';
import {createServer} from 'http';
import EventEmitter from 'events';
import middleware from '../../src/request';
import pure from '../../src/pure';
import connect from '../../src/connect';

describe('http', () => {
  describe('real server', () => {
    // Create a server with a host and port
    let server;

    const createApp = middleware((req, res) => {
      res.end();
      return pure();
    });

    beforeEach((done) => {
      server = createServer();
      connect(createApp(), server).listen(done);
    });

    afterEach((done) => {
      server.close(done);
      server = null;
    });

    it('should return a result', () => {
      return request(server).get('/').then((res) => {
        expect(res).to.have.status(200);
      });
    });
  });

  it('should not listen on arbitrary properties', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const app = {request: spy1, foo: spy2};
    const server = new EventEmitter();
    connect(app, server);
    server.emit('request');
    server.emit('foo');
    expect(spy1).to.be.calledOnce;
    expect(spy2).not.be.called;
  });

  it('should invoke `listening` if already listening', () => {
    const spy1 = sinon.spy();
    const app = {listening: spy1};
    const server = new EventEmitter();
    server.listening = true;
    connect(app, server);
    expect(spy1).to.be.calledOnce;
  });
});
