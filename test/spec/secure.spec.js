import {expect} from 'chai';
import sinon from 'sinon';

import secure from '../../src/secure';

describe('secure', () => {
  it('should enable strict transport security', () => {
    const spy = sinon.spy();
    const app = secure()({request: spy});
    app.request({headers: {}, connection: {encrypted: true}}, {setHeader: spy});
    expect(spy).to.be.calledWith('Strict-Transport-Security');
  });

  it('should redirect to HTTPS', () => {
    const spy = sinon.spy();
    const app = secure()({request: spy});
    app.request({
      url: '/foo',
      headers: {
        host: 'foo.com',
      },
      connection: {encrypted: false},
    }, {
      writeHead: spy,
      end: () => {},
    });
    expect(spy).to.be.calledWith(302, {Location: 'https://foo.com/foo'});
  });
});
