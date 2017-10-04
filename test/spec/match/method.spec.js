import {expect} from 'chai';
import sinon from 'sinon';

import tap from '../../../src/tap';
import match from '../../../src/match';
import method from '../../../src/match/method';

describe('method match', () => {
  it('should handle `if` branch', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(method('GET'), tap(yes), tap(no))({request: next});

    app.request({
      method: 'GET',
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle `else` branch', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(method('GET'), tap(yes), tap(no))({request: next});

    app.request({
      method: 'POST',
    }, {});

    expect(yes).to.not.be.calledOnce;
    expect(no).to.be.calledOnce;
    expect(next).to.be.calledOnce;
  });
});
