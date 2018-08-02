import compression from '../../src/compression';

describe('/compression', () => {
  it('should work', () => {
    // TODO: FIXME: XXX
    const spy = jest.fn();
    compression()({request: spy});
  });
});
