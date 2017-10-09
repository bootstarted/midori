import {expect} from 'chai';
import sinon from 'sinon';
import bl from 'bl';
import {resolve} from 'path';

import serve from '../../src/serve';
import send from '../../src/send';

describe('serve', () => {
  let getHeader;
  let setHeader;
  let stream;
  let result;
  let nextApp;

  beforeEach(() => {
    getHeader = sinon.stub().returns('');
    setHeader = sinon.stub();
    result = new Promise((resolve, reject) => {
      nextApp = {
        request: () => resolve(null),
        error: reject,
      };
      stream = bl((err, result) => {
        err ? reject(err) : resolve(result);
      });
    });
    stream.finished = false;
    stream.getHeader = getHeader;
    stream.setHeader = setHeader;
  });

  it('should serve some files', () => {
    const app = serve({root: __dirname})();
    app.request({url: '/serve.spec.js', headers: {}, method: 'GET'}, stream);
    return result.then((data) => {
      expect(data.toString()).to.contain('import bl');
    });
  });

  it('should work with path prefixes', () => {
    const app = serve({root: __dirname})(nextApp);
    app.request({
      url: '/foo/serve.spec.js',
      path: '/foo',
      headers: {},
      method: 'GET',
    }, stream);
    return result.then((data) => {
      expect(data.toString()).to.contain('import bl');
    });
  });

  it('should call next handler with `final` set to `false`', () => {
    const app = serve({root: __dirname, final: false})(nextApp);
    app.request({url: '/404', headers: {}, method: 'GET'}, stream);
    return result.then((data) => {
      expect(data).to.be.null;
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
    })(nextApp);
    app.request({url: '/', headers: {}, method: 'GET'}, stream);
    return result.then((data) => {
      expect(data.length).to.equal(0);
      expect(spy).to.be.calledOnce;
    });
  });

  it('should by default return `204` on directories', () => {
    const app = serve({
      root: __dirname,
      index: false,
    })(nextApp);
    app.request({url: '/', headers: {}, method: 'GET'}, stream);
    return result.then((data) => {
      expect(data.length).to.equal(0);
      expect(stream.statusCode).to.equal(204);
    });
  });

  it('should invoke error handler on errors', () => {
    const app = serve({root: __dirname})(nextApp);
    app.request({url: '/404', headers: {}, method: 'GET'}, stream);
    return result.then(() => {
      throw new Error();
    }, (err) => {
      expect(err).to.have.property('statusCode', 404);
      return Promise.resolve();
    });
  });
});
