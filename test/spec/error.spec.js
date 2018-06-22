import {expect} from 'chai';
import sinon from 'sinon';
import compose from '../../src/compose';

import request from '../../src/request';
import pure from '../../src/pure';
import error from '../../src/error';
import fetch from '../../src/test/fetch';

describe('/error', () => {
  it('should handle errors', () => {
    const spy = sinon.spy();
    const app = compose(
      request(() => {
        throw new Error('foo');
      }),
      error((err) => {
        spy(err);
        return pure(err);
      }),
    );
    return fetch(app, '/').then(() => {
      expect(spy).to.be.called;
    });
  });

  it('should call higher up the error chain', () => {
    const spy = sinon.spy();
    const app = compose(
      request(() => {
        throw new Error('foo');
      }),
      error((err) => {
        throw err;
      }),
    );
    return fetch(app, '/', {onError: spy}).then(() => {
      expect(spy).to.be.called;
    });
  });

  it('should call higher up the error chain', () => {
    const spy = sinon.spy();
    const app = compose(
      request(() => {
        throw new Error('foo');
      }),
      error((err) => {
        throw err;
      }),
    );
    return fetch(app, '/', {
      onError: spy,
      headers: {
        Connection: 'Upgrade',
      },
    }).then(() => {
      expect(spy).to.be.called;
    });
  });
});
