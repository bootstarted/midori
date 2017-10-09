import {expect} from 'chai';
import sinon from 'sinon';
import bl from 'bl';

import compose from '../../src/compose';
import logging, {
  formatStatusCode,
  dev,
  formatResponseTime,
  consoleLogger,
} from '../../src/logging';
import send from '../../src/send';

describe('logging', () => {
  it('should do some things', (done) => {
    const spy = sinon.spy();
    const app = compose(
      logging(dev(spy)),
      send('test')
    )();
    const res = bl(() => {
      try {
        expect(res).not.to.be.null;
        done();
      } catch (err) {
        done(err);
      }
    });
    res.setHeader = () => {};
    res.writeHead = () => {};
    res.finished = false;
    app.request({}, res);
  });

  describe('dev', () => {
    it('should write out the error if it exists', () => {
      const spy = sinon.spy();
      const logger = dev(spy);
      logger({error: new Error()}, {});
    });
  });

  describe('formatStatusCode', () => {
    it('should success', () => {
      formatStatusCode(200);
    });
    it('should info', () => {
      formatStatusCode(300);
    });
    it('should client error', () => {
      formatStatusCode(400);
    });
    it('should server error', () => {
      formatStatusCode(500);
    });
    it('should upgrade', () => {
      formatStatusCode(100);
    });
  });

  describe('consoleLogger', () => {
    it('should log', () => {
      consoleLogger('test');
    });
  });

  describe('formatResponseTime', () => {
    it('should work without timing', () => {
      formatResponseTime(null, null);
    });

    it('should work with missing timing', () => {
      formatResponseTime({}, {});
    });

    it('should work with correct timing', () => {
      formatResponseTime({start: 1, end: 1}, {headers: 1, start: 1, end: 1});
    });
  });
});
