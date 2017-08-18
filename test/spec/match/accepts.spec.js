import {expect} from 'chai';
import sinon from 'sinon';

import compose from '../../../src/compose';
import tap from '../../../src/tap';
import match from '../../../src/match';
import accepts from '../../../src/match/accepts';

describe('accepts match', () => {
  it('should handle strings', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      accepts(['application/*']),
      tap(yes),
      tap(no)
    )({request: next});

    app.request({
      headers: {'content-type': 'application/json'},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });

  it('should handle multiple', () => {
    const yes = sinon.spy();
    const no = sinon.spy();
    const next = sinon.spy();
    const app = match(
      compose(
        accepts(['application/*']),
        accepts(['*/json'])
      ),
      tap(yes),
      tap(no)
    )({request: next});

    app.request({
      headers: {'content-type': 'application/json'},
    }, {});

    expect(yes).to.be.calledOnce;
    expect(no).to.not.be.calledOnce;
    expect(next).to.be.calledOnce;
  });
});
