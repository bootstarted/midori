import {expect} from 'chai';
import sinon from 'sinon';
import baseApp from '../../../src/internal/baseApp';

describe('internal/baseApp', () => {
  it('should end the response if not already ended', () => {
    const res = {end: sinon.spy()};
    baseApp.request({}, res);
    expect(res.end).to.be.called;
  });

  it('should end the response if not already ended', () => {
    const res = {finished: true, end: sinon.spy()};
    baseApp.request({}, res);
    expect(res.end).to.not.be.called;
  });

  it('should set the status code to 404', () => {
    const res = {finished: false, end: sinon.spy()};
    baseApp.request({}, res);
    expect(res.statusCode).to.equal(404);
  });

  it('should not set the status code if headers have been sent', () => {
    const res = {
      finished: false,
      headersSent: true,
      end: sinon.spy(),
      statusCode: 200,
    };
    baseApp.request({}, res);
    expect(res.statusCode).to.equal(200);
  });

  it('should provide a server listener', (done) => {
    const server = baseApp.listen(() => {
      server.close(done);
    });
  });

  it('should provide a default error handler', () => {
    const err = new Error('test');
    const result = baseApp.error(err);
    expect(err.message).to.equal(result.message);
  });

  it('should provide a default upgrade handler', () => {
    const socket = {end: sinon.spy()};
    baseApp.upgrade({}, socket);
    expect(socket.end).to.be.called;
  });

  it('should not call upgrade handler if one listener', () => {
    const socket = {end: sinon.spy()};
    baseApp.listenerCount = () => 1;
    baseApp.upgrade({}, socket);
    expect(socket.end).to.be.called;
  });

  it('should not call upgrade handler if other listeners', () => {
    const socket = {end: sinon.spy()};
    baseApp.listenerCount = () => 2;
    baseApp.upgrade({}, socket);
    expect(socket.end).not.to.be.called;
  });
});
