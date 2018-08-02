import secure from '../../src/secure';
import fetch from '../../src/test/fetch';

describe('/secure', () => {
  it('should enable strict transport security', () => {
    return fetch(secure(), '/', {encrypted: true}).then((res) => {
      expect(res.getHeader('Strict-Transport-Security')).toEqual(
        expect.stringMatching(/max-age=/),
      );
    });
  });

  it('should redirect to HTTPS', () => {
    return fetch(secure(), '/', {
      encrypted: false,
      headers: {
        host: 'foo.com',
      },
    }).then((res) => {
      expect(res.getHeader('Location')).toEqual('https://foo.com/');
    });
  });
});
