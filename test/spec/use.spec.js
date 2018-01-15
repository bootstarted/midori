import {expect} from 'chai';
import use from '../../src/use';
import send from '../../src/send';

describe('use', () => {
  it('should create an app', () => {
    const app = use('/foo', send('hello'))();
    expect(app).to.be.a('object');
  });
});
