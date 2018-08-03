import compose from '../../src/compose';
import status from '../../src/status';
import send from '../../src/send';
import fetch from '../../src/test/fetch';

describe('/status', () => {
  it('should set res.statusCode', () => {
    const app = compose(
      status(200),
      send(''),
    );
    return fetch(app).then((res) => {
      expect(res.statusCode).toBe(200);
    });
  });
});
