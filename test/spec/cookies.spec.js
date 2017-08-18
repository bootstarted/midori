import {expect} from 'chai';
import sinon from 'sinon';

import cookies from '../../src/cookies';

describe('cookies', () => {
  it('should assign a cookies property to the request', () => {
    const spy = sinon.spy();
    const app = cookies()({request: spy});
    app.request({}, {});
    expect(spy).to.be.calledWithMatch((req) => !!req.cookies);
  });
});
