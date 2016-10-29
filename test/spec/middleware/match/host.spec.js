import { expect } from 'chai';
import sinon from 'sinon';

import tap from '../../../../src/middleware/tap';
import match from '../../../../src/middleware/match';
import host from '../../../../src/middleware/match/host';

describe('host match', () => {
  it('should handle strings', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host('foo.com'), tap(yes), tap(no))({ request: next });

    app.request({
      headers: {host: 'foo.com'},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle regexps', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host(/^foo/), tap(yes), tap(no))({ request: next });

    app.request({
      headers: {host: 'foo.com'},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle functions', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host(
      (h) => h === 'foo.com'
    ), tap(yes), tap(no))({ request: next });

    app.request({
      headers: {host: 'foo.com'},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle arrays', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(host([
      (h) => h === 'foo.com',
    ]), tap(yes), tap(no))({ request: next });

    app.request({
      headers: {host: 'foo.com'},
    }, {});

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
