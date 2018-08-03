import bl from 'bl';

import send from '../../src/send';
import fetch from '../../src/test/fetch';

describe('/send', () => {
  it('should not call next request', () => {
    const onNext = jest.fn();
    return fetch(send('foo'), '/', {onNext}).then(() => {
      expect(onNext).not.toHaveBeenCalled();
    });
  });

  it('should work with buffers', () => {
    const data = new Buffer('hello');
    return fetch(send(data), '/').then((res) => {
      expect(res.body).toEqual('hello');
    });
  });

  it('should send status and headers', () => {
    const data = new Buffer('hello');
    return fetch(send(307, {foo: 'bar'}, data), '/').then((res) => {
      expect(res.statusCode).toEqual(307);
      expect(res.headers.foo).toEqual('bar');
      expect(res.body).toEqual('hello');
    });
  });

  it('should work with streams', () => {
    const data = new Buffer('hello');
    return fetch(send(bl(data)), '/').then((res) => {
      expect(res.body).toEqual('hello');
    });
  });

  it('should fail for invalid values', () => {
    expect(() => {
      send(false);
    }).toThrow(TypeError);
  });

  it('should fail with no arguments', () => {
    expect(() => {
      send();
    }).toThrow(TypeError);
  });
});
