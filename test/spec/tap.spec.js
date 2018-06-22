import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../src/tap';
import fetch from '../../src/test/fetch';

describe('/tap', () => {
  it('should call the tap function', async () => {
    const spy = sinon.spy();
    const app = tap(spy);
    await fetch(app, '/');
    expect(spy).to.be.called;
  });

  it('should continue the chain', async () => {
    const next = sinon.spy();
    const app = tap(() => {});
    await fetch(app, '/', {
      onNext: next,
    });
    expect(next).to.be.called;
  });
});
