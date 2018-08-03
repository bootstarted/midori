import id from '../../src/id';
import send from '../../src/send';
import fetch from '../../src/test/fetch';

describe('/id', () => {
  it('should assign an id property to the request', async () => {
    const app = id(send);
    const res = await fetch(app);
    expect(res.body).toEqual(expect.stringMatching(/[a-e0-9]+/));
  });
});
