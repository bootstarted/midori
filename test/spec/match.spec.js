import {expect} from 'chai';
import sinon from 'sinon';

import every from '../../src/match/every';
import tap from '../../src/tap';
import match from '../../src/match';
import host from '../../src/match/host';
import fetch from '../../src/test/fetch';

describe('/match', () => {
  it('should match both conjunctions', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(every(host(/foo/), host(/bar/)), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foobar.com'},
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should not match both conjunctions', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(every(host(/foo/), host(/bar/)), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(no).to.be.calledOnce;
    expect(yes).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle `yes` branch of upgrade', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      host(/foo/),
      () => ({upgrade: yes}),
      () => ({upgrade: no}),
    );

    await fetch(app, '/', {
      headers: {host: 'foo.com', connection: 'Upgrade'},
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
  });

  it('should handle `no` branch of upgrade', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      host(/foo/),
      () => ({upgrade: yes}),
      () => ({upgrade: no}),
    );

    await fetch(app, '/', {
      headers: {host: 'bar.com', connection: 'Upgrade'},
      onNext: next,
    });

    expect(no).to.be.calledOnce;
    expect(yes).to.not.be.calledOnce;
  });
});
