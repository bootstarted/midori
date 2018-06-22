import {expect} from 'chai';
import sinon from 'sinon';

import compose from '../../../src/compose';
import tap from '../../../src/tap';
import match from '../../../src/match';
import path from '../../../src/match/path';
import params from '../../../src/params';
import baseUrl from '../../../src/baseUrl';
import send from '../../../src/send';
import fetch from '../../../src/test/fetch';

describe('path match', () => {
  it('should handle `if` branch', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(path('/foo'), tap(yes), tap(no));

    await fetch(app, '/foo', {
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle `else` branch', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(path('/foo'), tap(yes), tap(no));

    await fetch(app, '/bar', {
      onNext: next,
    });

    expect(yes).to.not.be.calledOnce;
    expect(no).to.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle nested paths', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();

    const sub = match(path('/bar'), tap(yes), tap(no));
    const app = match(path('/foo'), sub);

    await fetch(app, '/foo/bar', {
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle nested root paths', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();

    const sub = match(path('/foo'), tap(yes), tap(no));

    const app = match(path('/'), sub);

    await fetch(app, '/foo', {
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle path parameters', async () => {
    const app = match(
      path('/foo/:bar'),
      params((p) => send(200, JSON.stringify(p))),
    );

    const res = await fetch(app, '/foo/hello');
    expect(JSON.parse(res.body).bar).to.equal('hello');
  });

  it('should handle isolated paths', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = compose(
      match(path('/foo'), tap(yes)),
      match(path('/bar'), tap(no)),
    );

    await fetch(app, '/foo/bar', {
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should set the complete matched path', async () => {
    const app = match(path('/foo/:bar/baz'), baseUrl((b) => send(200, b)));
    const res = await fetch(app, '/foo/hello/baz/qux');
    expect(res.body).to.equal('/foo/hello/baz');
  });

  it('should handle nested url parameters', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();

    const sub = match(path('/foo/:baz'), tap(yes), tap(no));

    const app = match(path('/bar/:qux'), sub);

    await fetch(app, '/bar/5/foo/9', {
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should fail on things that are not paths', () => {
    expect(() => {
      path('foo');
    }).to.throw(TypeError);
    expect(() => {
      path('http://www.foo.com');
    }).to.throw(TypeError);
  });
});
