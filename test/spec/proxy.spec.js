import Proxy from 'http-proxy';

import proxy from '../../src/proxy';

jest.mock('http-proxy', () => {
  const ws = jest.fn();
  const web = jest.fn();
  const on = jest.fn();
  return {
    createProxy: () => {
      const server = {
        ws,
        web,
        on,
      };
      return server;
    },
  };
});

describe('/proxy', () => {
  beforeEach(() => {
    const {ws, web} = Proxy.createProxy();
    ws.mockClear();
    web.mockClear();
  });

  it('shoud call the `web` proxy method on `request`', () => {
    const spy = jest.fn();
    const {web} = Proxy.createProxy();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({request: spy});
    app.request(1, 2);
    expect(web).toHaveBeenCalled();
  });

  it('shoud call the `ws` proxy method on `upgrade`', () => {
    const spy = jest.fn();
    const {ws} = Proxy.createProxy();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({upgrade: spy});
    app.upgrade(1, 2, 3);
    expect(ws).toHaveBeenCalled();
  });

  it('shoud hook `proxyReq`', () => {
    const options = {onRequest: 5};
    const {on} = Proxy.createProxy();
    proxy(options);
    expect(on).toHaveBeenCalled();
  });

  it('shoud hook `proxyRes`', () => {
    const options = {onResponse: 5};
    const {on} = Proxy.createProxy();
    proxy(options);
    expect(on).toHaveBeenCalled();
  });

  it('shoud forward `request` errors', () => {
    const spy = jest.fn();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({requestError: spy});
    const {web} = Proxy.createProxy();
    web.mockImplementation((a, b, c, d) => {
      d('foo');
    });
    app.request(1, 2);
    expect(spy).toHaveBeenCalled();
  });

  it('shoud forward `upgrade` errors', () => {
    const spy = jest.fn();
    const options = {target: 'http://www.google.ca'};
    const app = proxy(options)({upgradeError: spy});
    const {ws} = Proxy.createProxy();
    ws.mockImplementation((a, b, c, d, e) => {
      e('foo');
    });
    app.upgrade(1, 2, 3);
    expect(spy).toHaveBeenCalled();
  });
});
