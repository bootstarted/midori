import pending from '../../src/pending';
import next from '../../src/next';

jest.useFakeTimers();

describe('/pending', () => {
  it('should invoke failure handler after timeout', async () => {
    const spy = jest.fn();
    const onTimeout = () => ({request: spy});
    const app = pending((_fn) => {}, {timeout: 300, onTimeout})();
    const promise = app.request({on: () => {}}, {});
    jest.advanceTimersByTime(300);
    await promise;
    expect(spy).toHaveBeenCalled();
  });

  it('should invoke correct app when trigger is applied', async () => {
    const spy = jest.fn();
    let f;
    const app = pending(
      (fn) => {
        f = fn;
      },
      {timeout: 300},
    )({request: spy});
    const promise = app.request({on: () => {}}, {});
    jest.advanceTimersByTime(100);
    f(next);
    await promise;
    expect(spy).toHaveBeenCalled();
  });

  it('should handle disposer normally', async () => {
    const spy = jest.fn();
    const spy2 = jest.fn();
    let f;
    const app = pending(
      (fn) => {
        f = fn;
        return spy2;
      },
      {timeout: 300},
    )({request: spy});
    const promise = app.request({on: () => {}}, {});
    jest.advanceTimersByTime(100);
    f(next);
    await promise;
    expect(spy2).toHaveBeenCalled();
  });
});
