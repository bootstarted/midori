import * as verbs from '../../src/verbs';
import send from '../../src/send';

describe('/verbs', () => {
  it('should have some http methods', () => {
    expect(verbs.get).toBeInstanceOf(Function);
    expect(verbs.del).toBeInstanceOf(Function);
    expect(verbs.post).toBeInstanceOf(Function);
  });

  it('should create an app', () => {
    const app = verbs.get('/foo', send('hello'))();
    expect(app).toBeInstanceOf(Object);
  });
});
