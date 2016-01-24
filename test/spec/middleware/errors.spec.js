import { expect } from 'chai';
import sinon from 'sinon';

import errors, {
  defaultHandlers,
  getStatusCode,
} from '../../../src/middleware/errors';

const MATCH_HTML = /^<!DOCTYPE html>[\S\n]*?<html>[\S\s]*?<\/html>$/;
const MATCH_JSON = /^{[\S\s]*?}$/;

describe('errors', () => {
  // Create a server with a host and port
  let req;
  let res;
  let err;
  let next;

  let htmlSpy;
  let textSpy;
  let jsonSpy;

  beforeEach(() => {
    req = {
      headers: { },
    };
    res = {
      end: sinon.spy(),
      setHeader: sinon.spy(),
    };
    err = {
      statusCode: 501,
      message: 'message',
      stack: 'stack',
    };
    next = {
      error: sinon.spy(),
    };
    htmlSpy = sinon.spy(defaultHandlers, 'html');
    textSpy = sinon.spy(defaultHandlers, 'text');
    jsonSpy = sinon.spy(defaultHandlers, 'json');
  });

  afterEach(() => {
    res.end.reset();
    res.setHeader.reset();
    next.error.reset();
    htmlSpy.restore();
    textSpy.restore();
    jsonSpy.restore();
  });

  describe('handlers', () => {
    let app;
    let handlers;

    beforeEach(() => {
      handlers = {
        html: sinon.spy(),
        json: sinon.spy(),
        text: sinon.spy(),
      };

      app = errors({ handlers })(next);
    });

    it('should handle with html if no accept header is found', () => {
      expect(req.headers.accept).to.be.undefined;
      app.error(err, req, res);
      expect(handlers.html).to.have.been.calledWith(err, req, res);
    });

    it('should handle with matching accept type', () => {
      req.headers.accept = 'application/json';
      app.error(err, req, res);
      expect(handlers.json).to.have.been.calledWith(err, req, res);
    });

    it('should handle with html if sniff is disabled', () => {
      app = errors({ handlers, sniff: false })(next);
      req.headers.accept = 'application/json';
      app.error(err, req, res);
      expect(handlers.html).to.have.been.calledWith(err, req, res);
    });

    it('should handle forward to next if no accept header matches', () => {
      req.headers.accept = 'sandwich/ham-and-cheese';
      app.error(err, req, res);
      expect(next.error).to.have.been.calledWith(err, req, res);
    });
  });

  describe('handler', () => {
    describe('is a function', () => {
      it('should get called and type should not get sniffed', () => {
        const handler = sinon.spy();
        const app = errors({ handler })(next);

        app.error(err, req, res);
        expect(handler).to.have.been.calledWith(err, req, res);

        req.headers.accept = 'sandwich/ham-and-cheese';
        app.error(err, req, res);
        expect(handler).to.have.been.calledWith(err, req, res);

        req.headers.accept = 'application/json';
        app.error(err, req, res);
        expect(handler).to.have.been.calledWith(err, req, res);
      });
    });

    describe('is a string', () => {
      let handlers;

      beforeEach(() => {
        handlers = {
          html: sinon.spy(),
          json: sinon.spy(),
          text: sinon.spy(),
        };
      });

      it('should call maching from handlers', () => {
        const app = errors({ handlers, handler: 'text' })(next);

        app.error(err, req, res);
        expect(handlers.text).to.have.been.calledWith(err, req, res);
      });

      it('should use the html handler if no handler matches', () => {
        const app = errors({ handlers, handler: 'foo' })(next);

        app.error(err, req, res);
        expect(handlers.html).to.have.been.calledWith(err, req, res);
      });

      it(`should use the default html handler if no handler matches
        and no html handler is provided`, () => {
        const app = errors({ handlers: {}, handler: 'foo' })(next);

        app.error(err, req, res);
        expect(defaultHandlers.html).to.have.been.calledWith(err, req, res);
      });
    });

    describe('is not a string or a function', () => {
      let handlers;

      beforeEach(() => {
        handlers = {
          html: sinon.spy(),
          json: sinon.spy(),
          text: sinon.spy(),
        };
      });

      it('should use the html handler', () => {
        const app = errors({ handlers, handler: 'foo' })(next);

        app.error(err, req, res);
        expect(handlers.html).to.have.been.calledWith(err, req, res);
      });

      it(`should use the default html handler if
        no html handler is provided`, () => {
        const app = errors({ handlers: {}, handler: 'foo' })(next);

        app.error(err, req, res);
        expect(defaultHandlers.html).to.have.been.calledWith(err, req, res);
      });
    });

    describe('default handlers', () => {
      let app;
      beforeEach(() => {
        app = errors()(next);
      });

      it('should return html', () => {
        req.headers.accept = 'text/html';
        app.error(err, req, res);
        expect(res.setHeader).to.have.been
          .calledWith('Content-Type', 'text/html; charset=utf-8');
        expect(res.end).to.have.been.calledWith(sinon.match(MATCH_HTML));
      });

      it('should return json', () => {
        req.headers.accept = 'application/json';
        app.error(err, req, res);
        expect(res.setHeader).to.have.been
          .calledWith('Content-Type', 'application/json; charset=utf-8');
        expect(res.end).to.have.been.calledWith(sinon.match(MATCH_JSON));
      });

      it('should return text', () => {
        req.headers.accept = 'text/plain';
        app.error(err, req, res);
        expect(res.setHeader).to.have.been
          .calledWith('Content-Type', 'text/plain; charset=utf-8');
        expect(res.end).to.have.been.calledWith(sinon.match.string);
      });
    });

    describe('getStatusCode', () => {
      it('should return the status property of the error object', () => {
        expect(getStatusCode({ status: 502 })).to.equal(502);
      });

      it('should return the statusCode property of the error object', () => {
        expect(getStatusCode({ status: 503 })).to.equal(503);
      });

      it('should default to 500', () => {
        expect(getStatusCode()).to.equal(500);
        expect(getStatusCode({})).to.equal(500);
        expect(getStatusCode({ status: 'foobar' })).to.equal(500);
        expect(getStatusCode({ status: 200 })).to.equal(500);
        expect(getStatusCode({ status: 600 })).to.equal(500);
      });
    });
  });
});
