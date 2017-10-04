import sinon from 'sinon';

import compression from '../../src/compression';

describe('compression', () => {
  it('should work', () => {
    const spy = sinon.spy();
    compression()({request: spy});
  });
});
