import fetch from '../../src/test/fetch';
import compose from '../../src/compose';
import logger, {
  formatStatusCode,
  formatResponseTime,
  setConsole,
} from '../../src/logger';
import send from '../../src/send';

describe('logger', () => {
  let fakeConsole;
  let log;

  beforeEach(() => {
    log = '';
    fakeConsole = {
      log: (x) => {
        log += x;
      },
    };
    setConsole(fakeConsole);
  });

  it('should output data to the console', () => {
    const app = compose(
      logger,
      send(200, 'test'),
    );
    return fetch(app, '/foo').then(() => {
      expect(log).toEqual(expect.stringContaining('GET'));
      expect(log).toEqual(expect.stringContaining('200'));
      expect(log).toEqual(expect.stringContaining('/foo'));
      expect(log).toEqual(expect.stringContaining('ms'));
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

  describe('formatResponseTime', () => {
    it('should work without timing', () => {
      formatResponseTime(null);
    });

    it('should work with invalid timing', () => {
      formatResponseTime(false);
    });

    it('should work with correct timing', () => {
      formatResponseTime(1);
    });
  });
});
