import request from '../../src/request';
import apply from '../../src/apply';
import compose from '../../src/compose';
import error from '../../src/error';
import send from '../../src/send';
import createSelector from '../../src/createSelector';
import fetch from '../../src/test/fetch';

describe('/apply', () => {
  it('should call things only once', async () => {
    let i = 0;
    const agent = createSelector(request, request, () => {
      return {foo: i++};
    });

    const agent2 = createSelector(agent, (agent) => agent);

    const app = apply(agent, agent, agent2, (a1, a2, a3) => {
      return send(200, a1 === a2 && a1 === a3 ? 'true' : 'false');
    });

    const res = await fetch(app);
    expect(i).toEqual(1);
    expect(res.body).toEqual('true');
  });
  it('work with upgrade', async () => {
    const x = createSelector(request, () => {
      return 'foo';
    });
    const app = apply(x, (x) => send(200, x));
    const res = await fetch(app, '/', {
      headers: {Connection: 'Upgrade'},
    });
    expect(res.body).toEqual(expect.stringContaining('foo'));
  });
  it('work call error handler inner', async () => {
    const x = createSelector(request, () => {
      throw new Error();
    });
    const app = compose(
      apply(x, () => {
        return send(200, 'foo');
      }),
      error(() => {
        return send(200, 'bar');
      }),
    );
    const res = await fetch(app, '/');
    expect(res.body).toEqual(expect.stringContaining('bar'));
  });
  it('work call error handler inner with upgrade', async () => {
    const x = createSelector(request, () => {
      throw new Error();
    });
    const app = compose(
      apply(x, () => {
        return send(200, 'foo');
      }),
      error(() => {
        return send(200, 'bar');
      }),
    );
    const res = await fetch(app, '/', {
      headers: {Connection: 'Upgrade'},
    });
    expect(res.body).toEqual(expect.stringContaining('bar'));
  });
  it('work call error handler with upgrade', async () => {
    const x = createSelector(request, () => {
      return 'foo';
    });
    const app = compose(
      apply(x, () => {
        throw new Error();
      }),
      error(() => {
        return send(200, 'bar');
      }),
    );
    const res = await fetch(app, '/', {
      headers: {Connection: 'Upgrade'},
    });
    expect(res.body).toEqual(expect.stringContaining('bar'));
  });
});
