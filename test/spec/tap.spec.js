import tap from '../../src/tap';
import fetch from '../../src/test/fetch';

describe('/tap', () => {
  it('should call the tap function', async () => {
    const spy = jest.fn();
    const app = tap(spy);
    await fetch(app, '/');
    expect(spy).toHaveBeenCalled();
  });

  it('should continue the chain', async () => {
    const next = jest.fn();
    const app = tap(() => {});
    await fetch(app, '/', {
      onNext: next,
    });
    expect(next).toHaveBeenCalled();
  });
});
