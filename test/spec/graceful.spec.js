import graceful from '../../src/graceful';
import send from '../../src/send';
import compose from '../../src/compose';
import fetch from '../../src/test/fetch';

describe('/graceful', () => {
  it('should 502 when server is shutting down', async () => {
    const app = compose(
      graceful(),
      send(200, ''),
    );
    const res = await fetch(app, '/', {offline: true});
    expect(res.statusCode).toEqual(502);
  });
  it('should do nothing when the server is online', async () => {
    const app = compose(
      graceful(),
      send(200, ''),
    );
    const res = await fetch(app, '/');
    expect(res.statusCode).toEqual(200);
  });
});
