import { expect } from 'chai';
import verbs from '../../../../src/middleware/match/verbs';

describe('verbs', () => {
  it('should have some http methods', () => {
    expect(verbs.get).to.be.an.instanceof(Function);
  });
});
