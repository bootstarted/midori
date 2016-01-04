import { expect } from 'chai';
import sinon from 'sinon';

import useragent from '../../../src/middleware/useragent';

it('should assign an agent property to the request', () => {
  const spy = sinon.spy();
  const app = useragent()({ request: spy });
  app.request({ headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2)' +
      'AppleWebKit/537.36 (KHTML, like Gecko)' +
      'Chrome/47.0.2526.106 Safari/537.36',
  }}, {});
  expect(spy).to.be.calledWithMatch(req => !!req.agent);
});
