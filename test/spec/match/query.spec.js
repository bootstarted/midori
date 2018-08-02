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
