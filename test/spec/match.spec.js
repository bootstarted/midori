import every from '../../src/match/every';
import tap from '../../src/tap';
import match from '../../src/match';
import host from '../../src/match/host';
import fetch from '../../src/test/fetch';

describe('/match', () => {
  it('should match both conjunctions', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(every(host(/foo/), host(/bar/)), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foobar.com'},
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should not match both conjunctions', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(every(host(/foo/), host(/bar/)), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(no).toHaveBeenCalled();
    expect(yes).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle `yes` branch of upgrade', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(
      host(/foo/),
      () => ({upgrade: yes}),
      () => ({upgrade: no}),
    );

    await fetch(app, '/', {
      headers: {host: 'foo.com', connection: 'Upgrade'},
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
  });

  it('should handle `no` branch of upgrade', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(
      host(/foo/),
      () => ({upgrade: yes}),
      () => ({upgrade: no}),
    );

    await fetch(app, '/', {
      headers: {host: 'bar.com', connection: 'Upgrade'},
      onNext: next,
    });

    expect(no).toHaveBeenCalled();
    expect(yes).not.toHaveBeenCalled();
  });
});
