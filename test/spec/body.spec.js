import {expect} from 'chai';
import sinon from 'sinon';
import bl from 'bl';
import zlib from 'zlib';
import apply from '../../src/apply';
import body, {withOptions} from '../../src/body';
import send from '../../src/send';
import fetch from '../../src/test/fetch';

describe('/body', () => {
  it('should read the body', async () => {
    const app = body((body) => {
      return send(body);
    });

    const res = await fetch(app, '/', {
      body: 'hello',
    });
    expect(res.body).to.equal('hello');
  });
  it('should infer `charset` when present', async () => {
    const app = body((body) => {
      return send(body);
    });
    const res = await fetch(app, '/', {
      body: 'hello',
      headers: {
        'Content-Type': 'text/plain; charset=utf8',
      },
    });
    expect(res.body).to.equal('hello');
  });
  it('should use `charset` when explicitly set', async () => {
    const app = withOptions({charset: 'utf8'})((body) => {
      return send(body);
    });
    const res = await fetch(app, '/', {
      body: 'hello',
      headers: {
        'Content-Type': 'text/plain; charset=utf8',
      },
    });
    expect(res.body).to.equal('hello');
  });
  it('should support `deflate` content encoding', async () => {
    const app = body((body) => {
      return send(body);
    });
    const res = await fetch(app, '/', {
      body: bl('hello').pipe(zlib.createDeflate()),
      headers: {
        'Content-Encoding': 'deflate',
      },
    });
    expect(res.body).to.equal('hello');
  });
  it('should support `gzip` content encoding', async () => {
    const app = body((body) => {
      return send(body);
    });
    const res = await fetch(app, '/', {
      body: bl('hello').pipe(zlib.createGzip()),
      headers: {
        'Content-Encoding': 'gzip',
      },
    });
    expect(res.body).to.equal('hello');
  });
  it('should fail on garbage content encoding', async () => {
    const spy = sinon.spy();
    const app = body((body) => {
      return send(body);
    });
    await fetch(app, '/', {
      headers: {
        'Content-Encoding': 'foo',
      },
      onError: spy,
    });
    expect(spy).to.be.called;
  });
  it('should fail if the user tries to parse body twice', async () => {
    const spy = sinon.spy();
    const app = apply(
      withOptions({encoding: 'utf8'}),
      withOptions({encoding: 'utf16'}),
      (_bodyA, _bodyB) => send('hello'),
    );
    await fetch(app, '/', {
      onError: spy,
    });
    expect(spy).to.be.called;
  });
  it('should fail if `inflate` is false and encoding set', async () => {
    const spy = sinon.spy();
    const app = withOptions({inflate: false})((_bodyA) => send('hello'));
    await fetch(app, '/', {
      headers: {
        'Content-Encoding': 'gzip',
      },
      onError: spy,
    });
    expect(spy).to.be.called;
  });
  it('should support streams', async () => {
    const app = withOptions({stream: true})((body) => {
      expect(typeof body.read).to.equal('function');
      return send(body);
    });
    const res = await fetch(app, '/', {
      body: bl('hello'),
      headers: {
        'Content-Type': 'text/plain; charset=utf8',
      },
    });
    expect(res.body).to.equal('hello');
  });
});
