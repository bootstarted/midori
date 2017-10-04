import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import protocol from '../../../src/match/protocol';

describe('match/protocol', () => {
  it('should respect `x-forwarded-proto`', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(protocol('https'), tap(yes), tap(no))({request: next});

    app.request({
      connection: {},
      headers: {
        'x-forwarded-proto': 'https',
      },
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should fallback to connection proto', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(protocol('https'), tap(yes), tap(no))({request: next});

    app.request({
      connection: {encrypted: true},
      headers: {},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });
});
