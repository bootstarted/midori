import {expect} from 'chai';
import sinon from 'sinon';
import url from 'url';

import redirect from '../../src/redirect';
import fetch from '../../src/test/fetch';

describe('/redirect', () => {
  it('should not call next request', () => {
    const next = sinon.spy();
    const app = redirect('/foo');
    return fetch(app, '/', {onNext: next}).then(() => {
      expect(next).to.be.not.called;
    });
  });

  it('should set the status code and url', () => {
    const app = redirect('/foo');
    return fetch(app, '/').then((res) => {
      expect(res.statusCode).to.equal(302);
      expect(res.getHeader('Location')).to.equal('/foo');
    });
  });

  it('should work with url objects', () => {
    const app = redirect(url.parse('http://www.something.com/foo'));
    return fetch(app, '/').then((res) => {
      expect(res.statusCode).to.equal(302);
      expect(res.getHeader('Location')).to.equal(
        'http://www.something.com/foo',
      );
    });
  });

  it('should set the custom status code', () => {
    const app = redirect(304, '/foo');
    return fetch(app, '/').then((res) => {
      expect(res.statusCode).to.equal(304);
    });
  });

  it('should fail eagerly for invalid parameters', () => {
    expect(() => {
      redirect(false);
    }).to.throw(TypeError);
  });
});
