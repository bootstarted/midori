import compose from '../../src/compose';

describe('/compose', () => {
  it('should work with zero args', () => {
    expect(compose()('foo')).toEqual('foo');
  });
  it('should work with one arg', () => {
    expect(compose((x) => x + 1)(5)).toEqual(6);
  });
});
