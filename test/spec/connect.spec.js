import {request, expect} from 'chai';
import sinon from 'sinon';
import {createServer} from 'http';
import EventEmitter from 'events';
import send from '../../src/send';
import connect from '../../src/connect';

describe('/connect', () => {
  describe('real server', () => {
    // Create a server with a host and port
    let server;

    const app = send(200, '');

    beforeEach((done) => {
      server = createServer();
      connect(
        app,
        server,
      ).listen(done);
    });

    afterEach((done) => {
      server.close(done);
      server = null;
    });

    it('should return a result', () => {
      return request(server)
        .get('/')
        .then((res) => {
          expect(res).to.have.status(200);
        });
    });
  });

  it('should fail on invalid apps', () => {
    const server = new EventEmitter();
    expect(() => {
      connect(
        4,
        server,
      );
    }).to.throw(TypeError);
  });

  it('should not listen on arbitrary properties', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const app = () => ({request: spy1, foo: spy2});
    const server = new EventEmitter();
    connect(
      app,
      server,
    );
    server.emit('request');
    server.emit('foo');
    expect(spy1).to.be.calledOnce;
    expect(spy2).not.be.called;
  });

  it('should invoke `listening` if already listening', () => {
    const spy1 = sinon.spy();
    const app = () => ({listening: spy1});
    const server = new EventEmitter();
    server.listening = true;
    connect(
      app,
      server,
    );
    expect(spy1).to.be.calledOnce;
  });

  it('should catch request errors', () => {
    const spy = jest.fn();
    const app = () => ({request: jest.fn(), requestError: spy});
    const server = new EventEmitter();
    const req = new EventEmitter();
    const res = new EventEmitter();
    connect(
      app,
      server,
    );
    server.emit('request', req, res);
    server.emit('foo');
    req.emit('error');
    expect(spy).toHaveBeenCalled();
  });
  it('should catch response errors', () => {
    const spy = jest.fn();
    const app = () => ({request: jest.fn(), requestError: spy});
    const server = new EventEmitter();
    const req = new EventEmitter();
    const res = new EventEmitter();
    connect(
      app,
      server,
    );
    server.emit('request', req, res);
    server.emit('foo');
    res.emit('error');
    expect(spy).toHaveBeenCalled();
  });
  it('should catch upgrade request errors', () => {
    const spy = jest.fn();
    const app = () => ({request: jest.fn(), upgradeError: spy});
    const server = new EventEmitter();
    const req = new EventEmitter();
    const socket = new EventEmitter();
    connect(
      app,
      server,
    );
    server.emit('upgrade', req, socket);
    server.emit('foo');
    req.emit('error');
    expect(spy).toHaveBeenCalled();
  });
  it('should catch upgrade socket errors', () => {
    const spy = jest.fn();
    const app = () => ({request: jest.fn(), upgradeError: spy});
    const server = new EventEmitter();
    const req = new EventEmitter();
    const socket = new EventEmitter();
    connect(
      app,
      server,
    );
    server.emit('upgrade', req, socket);
    server.emit('foo');
    socket.emit('error');
    expect(spy).toHaveBeenCalled();
  });
});
