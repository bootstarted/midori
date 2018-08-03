import pure from '../../src/pure';

describe('/pure', () => {
  it('should return the same value for all functions', () => {
    const app = pure(5)();
    expect(app.request()).toEqual(5);
    expect(app.upgrade()).toEqual(5);
    expect(app.requestError()).toEqual(5);
    expect(app.upgradeError()).toEqual(5);
    expect(app.error()).toEqual(5);
    expect(app.listening()).toEqual(5);
    expect(app.close()).toEqual(5);
  });
});
