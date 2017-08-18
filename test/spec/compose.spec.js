import {expect} from 'chai';

import compose from '../../src/compose';

describe('compose', () => {
  it('should work with zero args', () => {
    expect(compose()('foo')).to.equal('foo');
  });
  it('should work with one arg', () => {
    expect(compose((x) => x + 1)(5)).to.equal(6);
  });
});
