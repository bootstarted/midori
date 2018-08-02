import url from 'url';

import redirect from '../../src/redirect';
import fetch from '../../src/test/fetch';

describe('/redirect', () => {
  it('should not call next request', () => {
    const next = jest.fn();
    const app = redirect('/foo');
    return fetch(app, '/', {onNext: next}).then(() => {
      expect(next).not.toHaveBeenCalled();
    });
  });

  it('should set the status code and url', () => {
    const app = redirect('/foo');
    return fetch(app, '/').then((res) => {
      expect(res.statusCode).toEqual(302);
      expect(res.getHeader('Location')).toEqual('/foo');
    });
  });

  it('should work with url objects', () => {
    const app = redirect(url.parse('http://www.something.com/foo'));
    return fetch(app, '/').then((res) => {
      expect(res.statusCode).toEqual(302);
      expect(res.getHeader('Location')).toEqual('http://www.something.com/foo');
    });
  });

  it('should set the custom status code', () => {
    const app = redirect(304, '/foo');
    return fetch(app, '/').then((res) => {
      expect(res.statusCode).toEqual(304);
    });
  });

  it('should fail eagerly for invalid parameters', () => {
    expect(() => {
      redirect(false);
    }).toThrow(TypeError);
  });
});
