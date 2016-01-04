import { expect } from 'chai';
import sinon from 'sinon';

import locale from '../../../src/middleware/locale';

it('should assign a locale property to the request', () => {
  const spy = sinon.spy();
  const app = locale({
    locales: [ 'en-US', 'en-GB' ],
  })({ request: spy });
  app.request({
    headers: {
      'accept-language': 'en-GB,en-US;q=0.8,en;q=0.6',
    },
  }, {});
  expect(spy).to.be.calledWithMatch(req => !!req.locale);
});
