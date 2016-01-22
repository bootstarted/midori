import { expect } from 'chai';
import sinon from 'sinon';

import send from '../../../src/middleware/send';

it('should call `res.end` with `res.body`', () => {
  const end = sinon.spy();
  const app = send()();
  app.request({ body: 'test' }, { end });
  expect(end).to.be.calledWith('test');
});

it('should call `res.end` with constant value', () => {
  const end = sinon.spy();
  const app = send('test')();
  app.request({}, { end });
  expect(end).to.be.calledWith('test');
});
