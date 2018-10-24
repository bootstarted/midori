import tap from '../../../src/tap';
import match from '../../../src/match';
import query from '../../../src/match/query';
import fetch from '../../../src/test/fetch';

describe('query match', () => {
  it('should handle `if` branch', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(query({baz: 'world'}), tap(yes), tap(no));

    await fetch(app, '/foo?bar=hello&baz=world', {onNext: next});

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle `else` branch', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(query({baz: 'world', qux: 'hello'}), tap(yes), tap(no));

    await fetch(app, '/foo?bar=hello&baz=world', {onNext: next});

    expect(yes).not.toHaveBeenCalled();
    expect(no).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle arrays', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(
      query([{baz: 'hello'}, {baz: 'world'}]),
      tap(yes),
      tap(no),
    );

    await fetch(app, '/foo?bar=hello&baz=world', {onNext: next});

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle no query', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(query({}), tap(yes), tap(no));

    await fetch(app, '/foo', {onNext: next});

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle weird objects', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(query({foo: {bar: {baz: 'hello'}}}), tap(yes), tap(no));

    await fetch(app, '/foo?foo[bar]=hello', {onNext: next});

    expect(no).toHaveBeenCalled();
    expect(yes).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle objects', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(query({foo: {bar: {baz: 'hello'}}}), tap(yes), tap(no));

    await fetch(app, '/foo?foo[bar][baz]=hello', {onNext: next});

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle multiple parameters', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(query({baz: 'hello'}), tap(yes), tap(no));

    await fetch(app, '/foo?bar=hello&baz[]=hello&baz[]=world', {onNext: next});

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
