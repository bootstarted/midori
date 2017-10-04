import {expect} from 'chai';
import * as verbs from '../../src/verbs';
import send from '../../src/send';

describe('verbs', () => {
  it('should have some http methods', () => {
    expect(verbs.get).to.be.an.instanceof(Function);
    expect(verbs.del).to.be.an.instanceof(Function);
    expect(verbs.post).to.be.an.instanceof(Function);
  });

  it('should create an app', () => {
    const app = verbs.get('/foo', send('hello'))();
    expect(app).to.be.an.object;
  });
});
