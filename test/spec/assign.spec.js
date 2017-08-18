import {expect} from 'chai';
import sinon from 'sinon';

import assign from '../../src/assign';

describe('assign', () => {
  it('should assign properties to the request handler', () => {
    const spy = sinon.spy();
    const req = {};
    const res = {};
    const app = assign({foo: 1}, {bar: 2})({request: spy});
    app.request(req, res);
    expect(req).to.have.property('foo', 1);
    expect(res).to.have.property('bar', 2);
  });
});
