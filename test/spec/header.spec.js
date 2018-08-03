import header from '../../src/header';
import fetch from '../../src/test/fetch';

describe('/header', () => {
  it('should call next request', async () => {
    const next = jest.fn();
    const app = header('foo', 'bar');
    await fetch(app, '/', {
      onNext: next,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should call res.setHeader', async () => {
    const app = header('foo', 'bar');
    const res = await fetch(app, '/');
    expect(res.getHeader('foo')).toEqual('bar');
  });
});
