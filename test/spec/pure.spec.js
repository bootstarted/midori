import {expect} from 'chai';
import pure from '../../src/pure';

describe('/pure', () => {
  it('should return the same value for all functions', () => {
    const app = pure(5)();
    expect(app.request()).to.equal(5);
    expect(app.upgrade()).to.equal(5);
    expect(app.requestError()).to.equal(5);
    expect(app.upgradeError()).to.equal(5);
    expect(app.error()).to.equal(5);
    expect(app.listening()).to.equal(5);
    expect(app.close()).to.equal(5);
  });
});
