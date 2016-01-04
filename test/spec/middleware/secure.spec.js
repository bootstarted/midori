import { expect } from 'chai';
import sinon from 'sinon';

import secure from '../../../src/middleware/secure';

it('should enable strict transport security', () => {
  const spy = sinon.spy();
  const app = secure({ secure: true })({ request: spy });
  app.request({}, { setHeader: spy });
  expect(spy).to.be.calledWith('Strict-Transport-Security');
});
