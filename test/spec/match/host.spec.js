import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import host from '../../../src/match/host';
import fetch from '../../../src/test/fetch';

describe('host match', () => {
  it('should handle strings', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host('foo.com'), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle regexps', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host(/^foo/), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle functions', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host((h) => h === 'foo.com'), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle arrays', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host([(h) => h === 'foo.com']), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should blow up on invalid values', () => {
    expect(() => {
      host(false);
    }).to.throw(TypeError);
  });
});
