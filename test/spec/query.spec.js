import send from '../../src/send';
import query from '../../src/query';
import fetch from '../../src/test/fetch';

describe('/query', () => {
  it('should give query object', async () => {
    const app = query((q) => {
      return send(200, q.message);
    });
    const res = await fetch(app, '/?message=hello');
    expect(res.body).toEqual('hello');
  });
});
