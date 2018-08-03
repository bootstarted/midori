import tap from '../../../src/tap';
import match from '../../../src/match';
import host from '../../../src/match/host';
import fetch from '../../../src/test/fetch';

describe('host match', () => {
  it('should handle strings', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(host('foo.com'), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle regexps', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(host(/^foo/), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle functions', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(host((h) => h === 'foo.com'), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle arrays', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(host([(h) => h === 'foo.com']), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {host: 'foo.com'},
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should blow up on invalid values', () => {
    expect(() => {
      host(false);
    }).toThrow(TypeError);
  });
});
