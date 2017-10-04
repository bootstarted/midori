import {expect} from 'chai';
import sinon from 'sinon';

import graceful from '../../src/graceful';

describe('graceful', () => {
  it('should 502 when server is shutting down', () => {
    const stub = sinon.stub();
    const spy = sinon.spy();
    const app = graceful()({request: spy});
    const res = {setHeader: stub, end: stub};
    app.request({socket: {_handle: null}}, res);
    expect(res).to.have.property('statusCode', 502);
    expect(spy).not.to.be.called;
  });
  it('should do nothing when the server is online', () => {
    const spy = sinon.spy();
    const app = graceful()({request: spy});
    app.request({socket: {_handle: true}}, {});
    expect(spy).to.be.called;
  });
});
