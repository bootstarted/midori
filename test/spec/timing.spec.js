import apply from '../../src/apply';
import compose from '../../src/compose';
import pure from '../../src/pure';
import request from '../../src/request';
import response from '../../src/response';
import send from '../../src/send';
import timing, {setMark} from '../../src/timing';
import fetch from '../../src/test/fetch';

describe('/timing', () => {
  let mark;

  beforeEach(() => {
    mark = jest.fn(() => [0, 0]);
    setMark(mark);
  });

  describe('/headers', () => {
    it('should resolve if ended', async () => {
      let stamp = null;
      const app = compose(
        (x) =>
          apply(
            timing.headers,
            (_1) => (_2) => x,
            (timing, res) => {
              stamp = timing;
              return pure(res);
            },
          )(x),
        request(() => {
          return send(200, 'hello');
        }),
      );
      await fetch(app, '/');
      // FIXME: Make this work properly.
      expect(stamp).toEqual(0);
    });
    it('should resolve on headers', async () => {
      let stamp = null;
      const app = compose(
        (x) =>
          apply(
            timing.headers,
            (_1) => (_2) => x,
            (timing, res) => {
              stamp = timing;
              return pure(res);
            },
          )(x),
        response((res) => {
          return new Promise((resolve) => {
            // FIXME: Find better way of doing this.
            setTimeout(() => {
              res.writeHead(200);
              resolve(pure(null));
            }, 2);
          });
        }),
      );
      await fetch(app, '/');
      // FIXME: Make this work properly.
      expect(stamp).toEqual(0);
    });
  });
  describe('/end', () => {
    it('should resolve', async () => {
      let stamp = null;
      const app = compose(
        (x) =>
          apply(
            timing.end,
            (_1) => (_2) => x,
            (timing, res) => {
              stamp = timing;
              return pure(res);
            },
          )(x),
        request(async () => {
          return send(200, 'hello');
        }),
      );
      await fetch(app, '/');
      // FIXME: Make this work properly.
      expect(stamp).toEqual(0);
    });
  });
});
