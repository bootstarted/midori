import { expect } from 'chai';
import sinon from 'sinon';

import empty from '../../src/empty';

it('should `404` by default', () => {
  const spy = sinon.spy();
  const res = { end: spy };
  const app = empty();
  app.request({}, res);
  expect(res).to.have.property('statusCode', 404);
});

it('should throw errors it encounters', () => {
  const app = empty();
  expect(() => {
    app.error(new Error());
  }).to.throw(Error);
});
