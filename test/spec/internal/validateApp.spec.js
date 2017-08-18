import {expect} from 'chai';
import validateApp from '../../../src/internal/validateApp';

describe('internal/validateApp', () => {
  it('should fail if no request handler', () => {
    expect(() => {
      validateApp({error: () => {}});
    }).to.throw(TypeError);
  });
  it('should fail if no error hanlder', () => {
    expect(() => {
      validateApp({request: () => {}});
    }).to.throw(TypeError);
  });
});
