import {expect} from 'chai';
import sinon from 'sinon';
import {resolve} from 'path';

import compose from '../../src/compose';
import serve from '../../src/serve';
import send from '../../src/send';
import fetch from '../../src/test/fetch';
import {baseUrl} from '../../src/match/path';

describe('/serve', () => {
  it('should serve some files', () => {
    const app = serve({root: __dirname});
    return fetch(app, '/serve.spec.js').then((res) => {
      expect(res.body).to.contain('import sinon');
    });
  });

  it('should work with path prefixes', () => {
    const app = serve({root: __dirname});
    return fetch(app, '/foo/serve.spec.js', {
      mapRequest: (req) => {
        baseUrl.set(req, '/foo');
        return req;
      },
    }).then((res) => {
      expect(res.body).to.contain('import sinon');
    });
  });

  it('should call next handler with `final` set to `false`', () => {
    const app = compose(
      serve({root: __dirname, final: false}),
      send('hello'),
    );
    return fetch(app, '/404').then((res) => {
      expect(res.body).to.equal('hello');
    });
  });

  it('should invoke directory handler on directories', () => {
    const spy = sinon.spy();
    const app = serve({
      root: __dirname,
      index: false,
      onDirectory: (path) => {
        spy(resolve(path));
        return send('');
      },
    });
    return fetch(app, '/').then((res) => {
      expect(res.body.length).to.equal(0);
      expect(spy).to.be.calledOnce;
    });
  });

  it('should by default return `204` on directories', () => {
    const app = serve({
      root: __dirname,
      index: false,
    });
    return fetch(app, '/').then((res) => {
      expect(res.body.length).to.equal(0);
      expect(res.statusCode).to.equal(204);
    });
  });

  it('should invoke error handler on errors', () => {
    const app = serve({root: __dirname});
    return fetch(app, '/404').then(
      () => {
        throw new Error();
      },
      (err) => {
        expect(err).to.have.property('statusCode', 404);
        return Promise.resolve();
      },
    );
  });
});
