import {expect} from 'chai';
import bl from 'bl';
import onFinished from 'on-finished';

import compose from '../../src/compose';
import timing from '../../src/timing';
import send from '../../src/send';

describe('timing', (done) => {
  it('should do some math', () => {
    const app = compose(
      timing(),
      send('test')
    )();
    const res = bl(() => {});
    const req = bl('test');
    res.setHeader = () => {};
    res.writeHead = () => {};
    app.request(req, res);

    onFinished(res, () => {
      expect(res).to.have.property('timing').to.have.property('end');
      expect(req).to.have.property('timing').to.have.property('end');
      done();
    });
  });
});
