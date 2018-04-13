import {expect} from 'chai';
import sinon from 'sinon';
import bl from 'bl';

import compose from '../../src/compose';
import next from '../../src/next';
import header from '../../src/header';
import send from '../../src/send';
import upgrade from '../../src/upgrade';
import response from '../../src/response';
import fetch from '../../src/test/fetch';

describe('/response', () => {
  describe('upgrade events', () => {
    it('should read data sent via socket', async () => {
      const app = compose(
        response(() => {
          return next;
        }),
        upgrade(({socket}) => {
          socket.write(
            'HTTP/1.1 543 Potato\r\n' + 'Connection: Close\r\n' + '\r\n',
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
      expect(result.headers.connection).to.equal('Close');
      expect(result.statusCode).to.equal(543);
      expect(result.body).to.contain('hello Close');
    });
    it('should read data sent via socket', async () => {
      const app = compose(
        response(() => {
          return next;
        }),
        upgrade(({socket}) => {
          socket.end(
            'HTTP/1.1 543 Potato\r\n' + 'Connection: Close\r\n' + '\r\n',
          );
          return next;
        }),
      );
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.headers.connection).to.equal('Close');
      expect(result.statusCode).to.equal(543);
    });
    it('should write data to socket', async () => {
      const app = send(474, {foo: ['a', 'b'], bar: 'c'}, 'hi');
      const result = await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
      });
      expect(result.headers.bar).to.equal('c');
      expect(result.body).to.contain('hi');
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
      expect(result.statusMessage).to.equal('OK');
      expect(result.body).to.contain('OK');
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
      expect(result.statusCode).to.equal(123);
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
      expect(result.statusCode).to.equal(777);
    });
    it('should propagate errors', async () => {
      const spy = sinon.spy();
      const app = response(() => {
        throw new Error();
      });
      await fetch(app, '/', {
        headers: {Connection: 'Upgrade'},
        onError: spy,
      });
      expect(spy).to.be.called;
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
      expect(res.headers.foo).to.be.undefined;
      expect(res.headers.baz).to.equal('bar');
    });
    it('should support streams', async () => {
      const app = response((res) => {
        bl('foo').pipe(res);
        return next;
      });
      const res = await fetch(app, '/', {
        headers: {Connection: 'upgrade'},
      });
      expect(res.body).to.contain('foo');
    });
  });
  describe('request events', () => {
    it('should work', async () => {
      const app = response((res) => {
        res.end('hello');
        return next;
      });
      const result = await fetch(app, '/');
      expect(result.body).to.equal('hello');
    });
    it('should propagate errors', async () => {
      const spy = sinon.spy();
      const app = response(() => {
        throw new Error();
      });
      await fetch(app, '/', {
        onError: spy,
      });
      expect(spy).to.be.called;
    });
  });
});
