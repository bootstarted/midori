import {expect} from 'chai';
import sinon from 'sinon';

import compose from '../../src/compose';
import next from '../../src/next';
import request from '../../src/request';
import error from '../../src/error';
import pure from '../../src/pure';

describe('request', () => {
  it('should call the next handler in sequence', () => {
    const spy = sinon.spy();
    const app = request(() => {
      return next;
    })({request: spy});
    app.request({}, {});
    expect(spy).to.be.called;
  });

  it('should allow for chaining', () => {
    const app = request(() => {
      return request(() => {
        return pure(5);
      });
    })();
    const result = app.request({}, {});
    expect(result).to.equal(5);
  });

  it('should work with promises', (done) => {
    const app = request(() => {
      return Promise.resolve(request(() => {
        return pure(5);
      }));
    })();
    const result = app.request({}, {});
    result.then((result) => {
      expect(result).to.equal(5);
      done();
    }).catch(done);
  });

  it('should handle promise errors', (done) => {
    const app = compose(
      request(() => {
        return Promise.reject(7);
      }),
      error((err) => {
        if (err === 7) {
          return pure(5);
        }
        return pure();
      })
    )();
    const result = app.request({}, {});
    result.then((result) => {
      expect(result).to.equal(5);
      done();
    }).catch(done);
  });

  it('should handle sync errors', () => {
    const app = compose(
      request(() => {
        throw new Error('test');
      }),
      error((err) => {
        if (err.message === 'test') {
          return pure(5);
        }
        return pure();
      })
    )();
    const result = app.request({}, {});
    expect(result).to.equal(5);
  });

  it('should fail is nothing is returned', () => {
    const app = compose(
      request(() => {
        return {};
      }),
      error((err) => {
        return pure(err);
      }),
    )();
    const result = app.request({}, {});
    expect(result).to.be.an.instanceof(TypeError);
  });
});
