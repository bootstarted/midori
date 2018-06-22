import Proxy from 'http-proxy';
import sinon from 'sinon';
import {expect} from 'chai';

import proxy from '../../src/proxy';

describe('/proxy', () => {
  let sandbox;
  let server;
  let ws;
  let web;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    ws = sandbox.stub();
    web = sandbox.stub();
    sandbox.stub(Proxy, 'createProxy').returns(
      (server = {
        ws,
        web,
        on: sandbox.stub(),
      }),
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('shoud call the `web` proxy method on `request`', () => {
    const spy = sinon.spy();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({request: spy});
    app.request(1, 2);
    expect(server.web).to.be.calledWithMatch(1, 2, options);
  });

  it('shoud call the `ws` proxy method on `upgrade`', () => {
    const spy = sinon.spy();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({upgrade: spy});
    app.upgrade(1, 2, 3);
    expect(server.ws).to.be.calledWith(1, 2, 3, options);
  });

  it('shoud hook `proxyReq`', () => {
    const options = {onRequest: 5};
    proxy(options);
    expect(server.on).to.be.calledWith('proxyReq', 5);
  });

  it('shoud hook `proxyRes`', () => {
    const options = {onResponse: 5};
    proxy(options);
    expect(server.on).to.be.calledWith('proxyRes', 5);
  });

  it('shoud forward `request` errors', () => {
    const spy = sinon.spy();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({requestError: spy});
    web.callsArgWith(3, 'foo');
    app.request(1, 2);
    expect(spy).to.be.calledWith('foo');
  });

  it('shoud forward `upgrade` errors', () => {
    const spy = sinon.spy();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({upgradeError: spy});
    ws.callsArgWith(4, 'foo');
    app.upgrade(1, 2, 3);
    expect(spy).to.be.calledWith('foo');
  });
});
