import compose from '../../src/compose';
import next from '../../src/next';
import request from '../../src/request';
import error from '../../src/error';
import pure from '../../src/pure';
import fetch from '../../src/test/fetch';

describe('/request', () => {
  it('should call the next handler in sequence', async () => {
    const spy = jest.fn();
    const app = request(() => {
      return next;
    });
    await fetch(app, '/', {
      onNext: spy,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should allow for chaining', async () => {
    const app = request(() => {
      return request(() => {
        return pure(5);
      });
    });
    const {result} = await fetch(app, '/');
    expect(result).toEqual(5);
  });

  it('should work with promises', async () => {
    const app = request(() => {
      return Promise.resolve(
        request(() => {
          return pure(5);
        }),
      );
    });
    const {result} = await fetch(app, '/');
    expect(result).toEqual(5);
  });

  it('should handle promise errors', async () => {
    const app = compose(
      request(() => {
        return Promise.reject(7);
      }),
      error((err) => {
        if (err === 7) {
          return pure(5);
        }
        return pure();
      }),
    );
    const {result} = await fetch(app, '/');
    expect(result).toEqual(5);
  });

  it('should handle sync errors', async () => {
    const app = compose(
      request(() => {
        throw new Error('test');
      }),
      error((err) => {
        if (err.message === 'test') {
          return pure(5);
        }
        return pure();
      }),
    );
    const {result} = await fetch(app, '/');
    expect(result).toEqual(5);
  });

  it('should fail is nothing is returned', async () => {
    const app = compose(
      request(() => {
        return {};
      }),
      error((err) => {
        return pure(err);
      }),
    );
    const {result} = await fetch(app, '/');
    expect(result).toBeInstanceOf(TypeError);
  });

  it('should handle upgrades', async () => {
    const spy = jest.fn();
    const app = compose(
      request(() => {
        spy();
        return next;
      }),
    );
    await fetch(app, '/', {
      headers: {Connection: 'upgrade'},
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should handle upgrade errors', async () => {
    const spy = jest.fn();
    const app = compose(
      request(() => {
        throw new Error();
      }),
      error(() => {
        spy();
        return next;
      }),
    );
    await fetch(app, '/', {
      headers: {Connection: 'upgrade'},
    });
    expect(spy).toHaveBeenCalled();
  });
});
