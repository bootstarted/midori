import bl from 'bl';

import compose from '../../src/compose';
import next from '../../src/next';
import header from '../../src/header';
import send from '../../src/send';
import error from '../../src/error';
import upgrade from '../../src/upgrade';
import response from '../../src/response';
import fetch from '../../src/test/fetch';

describe('/response', () => {
  describe('upgrade events', () => {
    it('should accept buffers to socket writes', async () => {
      const app = upgrade(({socket}) => {
        socket.end(
          Buffer.from(
            'HTTP/1.1 571 Potato\r\n' +
              'Connection: Close\r\n' +
              '\r\n' +
              '\r\n',
          ),
        );
        return next;
      });
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.statusCode).toEqual(571);
    });
    it('should work when response has ended', async () => {
      const spy = jest.fn();
      const app = compose(
        upgrade(({socket}) => {
          socket.end();
          socket.write(
            Buffer.from('HTTP/1.1 111 Potato\r\n' + '\r\n' + '\r\n'),
          );
          return next;
        }),
        error(() => {
          return send(571, {}, 'foo');
        }),
      );
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
        onError: spy,
      });
      expect(result.statusCode).toEqual(571);
      expect(spy).toHaveBeenCalled();
    });
    it('should accept custom encodings to socket writes', async () => {
      const app = compose(
        upgrade(({socket}) => {
          socket.end(
            'HTTP/1.1 111 Potato\r\n' +
              'Connection: Close\r\n' +
              '\r\n' +
              '\r\n',
            'utf8',
          );
          return next;
        }),
      );
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.statusCode).toEqual(111);
    });
    it('should read data sent via socket', async () => {
      const app = compose(
        upgrade(({socket}) => {
          socket.write(
            'HTTP/1.1 543 Potato\r\n' +
              'Connection: Close\r\n' +
              '\r\n' +
              '\r\n',
          );
          return next;
        }),
        response((res) => {
          return send(`hello ${res.getHeader('Connection')}`);
        }),
      );
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.headers.connection).toEqual('Close');
      expect(result.statusCode).toEqual(543);
      expect(result.body).toEqual(expect.stringContaining('hello Close'));
    });
    it('should read data sent via socket', async () => {
      const app = upgrade(({socket}) => {
        socket.end(
          'HTTP/1.1 543 Potato\r\n' + 'Connection: Close\r\n' + '\r\n',
        );
        return next;
      });
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.headers.connection).toEqual('Close');
      expect(result.statusCode).toEqual(543);
    });
    it('should write data to socket', async () => {
      const app = send(474, {foo: ['a', 'b'], bar: 'c'}, 'hi');
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.headers.bar).toEqual('c');
      expect(result.body).toEqual(expect.stringContaining('hi'));
    });
    it('should support `writeHead` with a `statusMessage`', async () => {
      const app = response((res) => {
        res.writeHead(200, 'OK', {foo: 'c'});
        res.end();
        return next;
      });
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.statusMessage).toEqual('OK');
      expect(result.body).toEqual(expect.stringContaining('OK'));
    });
    it('should support `writeHead`', async () => {
      const app = response((res) => {
        res.writeHead(123, null, {foo: 'c'});
        res.end();
        return next;
      });
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.statusCode).toEqual(123);
    });
    it('should `writeHead` on end', async () => {
      const app = response((res) => {
        res.statusCode = 777;
        res.end();
        return next;
      });
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.statusCode).toEqual(777);
    });
    it('should propagate errors', async () => {
      const spy = jest.fn();
      const app = response(() => {
        throw new Error();
      });
      await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
        onError: spy,
      });
      expect(spy).toHaveBeenCalled();
    });
    it('should support `removeHeader`', async () => {
      const app = compose(
        header('foo', 'bar'),
        header('baz', 'bar'),
        response((res) => {
          res.removeHeader('foo');
          return next;
        }),
      );
      const res = await fetch(app, '/', {
        headers: {Connection: 'upgrade'},
      });
      expect(res.headers.foo).not.toBeDefined();
      expect(res.headers.baz).toEqual('bar');
    });
    it('should support streams', async () => {
      const app = response((res) => {
        bl('foo').pipe(res);
        return next;
      });
      const res = await fetch(app, '/', {
        headers: {Connection: 'upgrade'},
      });
      expect(res.body).toEqual(expect.stringContaining('foo'));
    });
  });
  describe('request events', () => {
    it('should work', async () => {
      const app = response((res) => {
        res.end('hello');
        return next;
      });
      const result = await fetch(app, '/');
      expect(result.body).toEqual('hello');
    });
    it('should propagate errors', async () => {
      const spy = jest.fn();
      const app = response(() => {
        throw new Error();
      });
      await fetch(app, '/', {
        onError: spy,
      });
      expect(spy).toHaveBeenCalled();
    });
  });
});
