import Proxy from 'http-proxy';
import sinon from 'sinon';
import {expect} from 'chai';

import proxy from '../../../src/middleware/proxy';

describe('proxy', () => {
  let sandbox;
  let server;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Proxy, 'createProxy').returns(server = {
      ws: sandbox.stub(),
      web: sandbox.stub(),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('shoud call the `web` proxy method on `request`', () => {
    const spy = sinon.spy();
    const options = { target: 'http://www.google.ca' };
    const app = proxy(options)({ request: spy });
    app.request(1, 2);
    expect(server.web).to.be.calledWithMatch(1, 2, options);
  });

  it('shoud call the `ws` proxy method on `upgrade`', () => {
    const spy = sinon.spy();
    const options = { target: 'http://www.google.ca' };
    const app = proxy(options)({ upgrade: spy });
    app.upgrade(1, 2, 3);
    expect(server.ws).to.be.calledWith(1, 2, 3, options);
  });
});
