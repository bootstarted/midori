import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import protocol from '../../../src/match/protocol';
import fetch from '../../../src/test/fetch';

describe('match/protocol', () => {
  it('should respect `x-forwarded-proto`', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(protocol('https'), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {
        'x-forwarded-proto': 'https',
      },
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should fallback to connection proto', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(protocol('https'), tap(yes), tap(no));

    await fetch(app, '/', {
      encrypted: true,
      onNext: next,
    });

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });
});
