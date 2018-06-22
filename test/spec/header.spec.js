import {expect} from 'chai';
import sinon from 'sinon';

import header from '../../src/header';
import fetch from '../../src/test/fetch';

describe('/header', () => {
  it('should call next request', async () => {
    const next = sinon.spy();
    const app = header('foo', 'bar');
    await fetch(app, '/', {
      onNext: next,
    });
    expect(next).to.be.calledOnce;
  });

  it('should call res.setHeader', async () => {
    const app = header('foo', 'bar');
    const res = await fetch(app, '/');
    expect(res.getHeader('foo')).to.equal('bar');
  });
});
