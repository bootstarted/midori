import {expect} from 'chai';
import sinon from 'sinon';

import every from '../../src/match/every';
import tap from '../../src/tap';
import match from '../../src/match';
import host from '../../src/match/host';

describe('match', () => {
  it('should match both conjunctions', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      every(host(/foo/), host(/bar/)),
      tap(yes),
      tap(no),
    )({request: next});

    app.request({
      headers: {host: 'foobar.com'},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should not match both conjunctions', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      every(host(/foo/), host(/bar/)),
      tap(yes),
      tap(no),
    )({request: next});

    app.request({
      headers: {host: 'foo.com'},
    }, {});

    expect(no).to.be.calledOnce;
    expect(yes).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle `yes` branch of upgrade', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      host(/foo/),
      () => ({upgrade: yes}),
      () => ({upgrade: no}),
    )({upgrade: next});

    app.upgrade({
      headers: {host: 'foo.com'},
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
  });

  it('should handle `no` branch of upgrade', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      host(/foo/),
      () => ({upgrade: yes}),
      () => ({upgrade: no}),
    )({upgrade: next});

    app.upgrade({
      headers: {host: 'bar.com'},
    });

    expect(no).to.be.calledOnce;
    expect(yes).to.not.be.calledOnce;
  });
});
