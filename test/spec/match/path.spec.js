import compose from 'lodash/flowRight';
import { expect } from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import path from '../../../src/match/path';

describe('path match', () => {
  it('should handle `if` branch', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(path('/foo'), tap(yes), tap(no))({ request: next });

    app.request({
      url: '/foo',
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle `else` branch', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(path('/foo'), tap(yes), tap(no))({ request: next });

    app.request({
      url: '/bar',
    }, {});

    expect(yes).to.not.be.calledOnce;
    expect(no).to.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle nested paths', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();

    const sub = match(path('/bar'), tap(yes), tap(no));

    const app = match(
      path('/foo'),
      sub
    )({ request: next });

    app.request({
      url: '/foo/bar',
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle nested root paths', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();

    const sub = match(path('/foo'), tap(yes), tap(no));

    const app = match(
      path('/'),
      sub
    )({ request: next });

    app.request({
      url: '/foo',
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle path parameters', () => {
    const yes = sinon.spy();
    const next = sinon.spy();
    const app = match(path('/foo/:bar'), tap(yes))({ request: next });

    app.request({
      url: '/foo/hello',
    }, {});

    expect(yes).to.be.calledWithMatch(req => req.params.bar === 'hello');
    expect(next).to.be.calledOnce;
  });

  it('should handle isolated paths', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = compose(
      match(path('/foo'), tap(yes)),
      match(path('/bar'), tap(no))
    )({ request: next });

    app.request({
      url: '/foo/bar',
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should set the complete matched path', () => {
    const yes = sinon.spy();
    const next = sinon.spy();
    const app = match(path('/foo/:bar/baz'), tap(yes))({ request: next });

    app.request({
      url: '/foo/hello/baz/qux',
    }, {});

    expect(yes).to.be.calledWithMatch(req => req.path === '/foo/hello/baz');
    expect(next).to.be.calledOnce;
  });
});
