import {expect} from 'chai';
import sinon from 'sinon';

import compose from '../../src/compose';
import next from '../../src/next';
import upgrade from '../../src/upgrade';
import fetch from '../../src/test/fetch';

describe('/upgrade', () => {
  it('should throw errors on normal requests', async () => {
    const spy = sinon.spy();
    const app = compose(
      upgrade(() => {
        return next;
      }),
    );
    await fetch(app, '/', {
      onError: spy,
    });
    expect(spy).to.be.called;
  });
});
