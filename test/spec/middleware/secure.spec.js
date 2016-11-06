import { expect } from 'chai';
import sinon from 'sinon';

import secure from '../../../src/middleware/secure';

it('should enable security headers', (done) => {
  const spy = sinon.spy();
  const res = { setHeader: spy };
  const app = secure({ secure: true })({ request: () => {} });
  app.request({}, res)
    .then(() => {
      expect(res.setHeader).to.be.calledWith('Strict-Transport-Security');
      expect(res.setHeader).to.be.calledWith('X-Frame-Options');
      expect(res.setHeader).to.be.calledWith('X-XSS-Protection');
      expect(res.setHeader).to.be.calledWith('X-Download-Options');
      expect(res.setHeader).to.be.calledWith('X-Content-Type-Options');
      done();
    });
});
