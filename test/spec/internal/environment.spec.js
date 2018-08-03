import {isProduction} from '../../../src/internal/environment';

describe('internal/environment', () => {
  it('should work', () => {
    isProduction();
  });
});
