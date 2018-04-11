import {expect} from 'chai';
import sinon from 'sinon';

import pending from '../../src/pending';
import next from '../../src/next';

describe('pending', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  it('should invoke failure handler after timeout', () => {
    const spy = sinon.spy();
    const onTimeout = () => ({request: spy});
    const app = pending((_fn) => {}, {timeout: 300, onTimeout})();
    const promise = app.request({on: () => {}}, {});
    clock.tick(300);
    return promise.then(() => {
      expect(spy).to.be.called;
    });
  });

  it('should invoke correct app when trigger is applied', () => {
    const spy = sinon.spy();
    let f;
    const app = pending((fn) => {
      f = fn;
    }, {timeout: 300})({request: spy});
    const promise = app.request({on: () => {}}, {});
    clock.tick(100);
    f(next);
    return promise.then(() => {
      expect(spy).to.be.called;
    });
  });

  it('should handle disposer normally', () => {
    const spy = sinon.spy();
    const spy2 = sinon.spy();
    let f;
    const app = pending((fn) => {
      f = fn;
      return spy2;
    }, {timeout: 300})({request: spy});
    const promise = app.request({on: () => {}}, {});
    clock.tick(100);
    f(next);
    return promise.then(() => {
      expect(spy2).to.be.called;
    });
  });
});
