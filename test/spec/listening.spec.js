import {expect} from 'chai';
import sinon from 'sinon';

import listening from '../../src/listening';

describe('/request', () => {
  it('should call the next handler in sequence', () => {
    const spy = sinon.spy();
    const app = listening(() => {
      return;
    })({listening: spy});
    app.listening();
    expect(spy).to.be.called;
  });
});
