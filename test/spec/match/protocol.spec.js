import tap from '../../../src/tap';
import match from '../../../src/match';
import protocol from '../../../src/match/protocol';
import fetch from '../../../src/test/fetch';

describe('match/protocol', () => {
  it('should respect `x-forwarded-proto`', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(protocol('https'), tap(yes), tap(no));

    await fetch(app, '/', {
      headers: {
        'x-forwarded-proto': 'https',
      },
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should fallback to connection proto', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(protocol('https'), tap(yes), tap(no));

    await fetch(app, '/', {
      encrypted: true,
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
