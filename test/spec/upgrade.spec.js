import compose from '../../src/compose';
import next from '../../src/next';
import upgrade from '../../src/upgrade';
import fetch from '../../src/test/fetch';

describe('/upgrade', () => {
  it('should throw errors on normal requests', async () => {
    const spy = jest.fn();
    const app = compose(
      upgrade(() => {
        return next;
      }),
    );
    await fetch(app, '/', {
      onError: spy,
    });
    expect(spy).toHaveBeenCalled();
  });
});
