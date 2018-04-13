import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import query from '../../../src/match/query';
import fetch from '../../../src/test/fetch';

describe('query match', () => {
  it('should handle `if` branch', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(query({baz: 'world'}), tap(yes), tap(no));

    await fetch(app, '/foo?bar=hello&baz=world', {onNext: next});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle `else` branch', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(query({baz: 'world', qux: 'hello'}), tap(yes), tap(no));

    await fetch(app, '/foo?bar=hello&baz=world', {onNext: next});

    expect(yes).to.not.be.calledOnce;
    expect(no).to.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle arrays', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      query([{baz: 'hello'}, {baz: 'world'}]),
      tap(yes),
      tap(no),
    )({request: next});

    await fetch(app, '/foo?bar=hello&baz=world', {onNext: next});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle multiple parameters', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(query({baz: 'hello'}), tap(yes), tap(no));

    await fetch(app, '/foo?bar=hello&baz[]=hello&baz[]=world', {onNext: next});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });
});
