import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import method from '../../../src/match/method';
import fetch from '../../../src/test/fetch';

describe('method match', () => {
  it('should handle `if` branch', async () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(method('GET'), tap(yes), tap(no));

    await fetch(app, '/', {
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
    const app = match(method('GET'), tap(yes), tap(no));

    await fetch(app, '/', {
      method: 'POST',
      onNext: next,
    });

    expect(yes).to.not.be.called;
    expect(no).to.be.calledOnce;
    expect(next).to.be.calledOnce;
  });
});
