import {expect} from 'chai';

import id from '../../src/id';
import send from '../../src/send';
import fetch from '../../src/test/fetch';

describe('/id', () => {
  it('should assign an id property to the request', () => {
    const app = id(send);
    return fetch(app).then((res) => {
      expect(res.body).to.match(/[a-e0-9]+/);
    });
  });
});
