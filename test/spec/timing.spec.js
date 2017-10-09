import {expect} from 'chai';
import bl from 'bl';
import onFinished from 'on-finished';

import compose from '../../src/compose';
import timing from '../../src/timing';
import send from '../../src/send';

describe('timing', () => {
  it('should do some math', (done) => {
    const app = compose(
      timing(),
      send('test')
    )();
    const req = bl('test');
    const res = bl(() => {});
    res.setHeader = () => {};
    res.writeHead = () => {};
    res.finished = false;
    app.request(req, res);
    onFinished(res, () => {
      try {
        expect(res).to.have.property('timing').to.have.property('end');
        expect(req).to.have.property('timing').to.have.property('start');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
