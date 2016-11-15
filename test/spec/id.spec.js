import { expect } from 'chai';
import sinon from 'sinon';

import id from '../../src/id';

it('should assign an id property to the request', () => {
  const spy = sinon.spy();
  const app = id()({ request: spy });
  app.request({}, { setHeader: sinon.spy() });
  expect(spy).to.be.calledWithMatch(req => !!req.id);
});
