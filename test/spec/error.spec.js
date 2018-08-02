import compose from '../../src/compose';
import request from '../../src/request';
import pure from '../../src/pure';
import error from '../../src/error';
import fetch from '../../src/test/fetch';

describe('/error', () => {
  it('should handle errors', async () => {
    const spy = jest.fn();
    const app = compose(
      request(() => {
        throw new Error('foo');
      }),
      error((err) => {
        spy(err);
        return pure(err);
      }),
    );
    await fetch(app, '/');
    expect(spy).toHaveBeenCalled();
  });

  it('should call higher up the error chain', async () => {
    const spy = jest.fn();
    const app = compose(
      request(() => {
        throw new Error('foo');
      }),
      error((err) => {
        throw err;
      }),
    );
    await fetch(app, '/', {onError: spy});
    expect(spy).toHaveBeenCalled();
  });

  it('should call higher up the error chain', async () => {
    const spy = jest.fn();
    const app = compose(
      request(() => {
        throw new Error('foo');
      }),
      error((err) => {
        throw err;
      }),
    );
    await fetch(app, '/', {
      onError: spy,
      headers: {
        Connection: 'Upgrade',
      },
    });
    expect(spy).toHaveBeenCalled();
  });
});
