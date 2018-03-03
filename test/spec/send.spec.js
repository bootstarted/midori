import {expect} from 'chai';
import sinon from 'sinon';
import bl from 'bl';

import send from '../../src/send';
import fetch from '../../src/test/fetch';

describe('send', () => {
  it('should not call next request', () => {
    const onNext = sinon.spy();
    return fetch(send('foo'), '/', {onNext}).then(() => {
      expect(onNext).not.to.have.been.called;
    });
  });

  it('should work with buffers', () => {
    const data = new Buffer('hello');
    return fetch(send(data), '/').then((res) => {
      expect(res.body).to.equal('hello');
    });
  });

  it('should work with streams', () => {
    const data = new Buffer('hello');
    const app = send(bl(data))();
    return fetch(app, '/').then((res) => {
      expect(res.body).to.equal('hello');
    });
  });

  it('should fail for invalid values', () => {
    expect(() => {
      send(false);
    }).to.throw(TypeError);
  });
});
