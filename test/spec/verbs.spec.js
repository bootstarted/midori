import {expect} from 'chai';
import * as verbs from '../../src/verbs';
import send from '../../src/send';

describe('/verbs', () => {
  it('should have some http methods', () => {
    expect(verbs.get).to.be.a('function');
    expect(verbs.del).to.be.a('function');
    expect(verbs.post).to.be.a('function');
  });

  it('should create an app', () => {
    const app = verbs.get('/foo', send('hello'))();
    expect(app).to.be.an('object');
  });
});
