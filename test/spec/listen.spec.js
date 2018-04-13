import listen from '../../src/listen';
import send from '../../src/send';

describe('/listen', () => {
  it('should listen', () => {
    // TODO: FIXME: Make this better.
    const server = listen(send('hello'), 0);
    server.close();
  });
});
