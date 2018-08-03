import tap from '../../../src/tap';
import match from '../../../src/match';
import method from '../../../src/match/method';
import fetch from '../../../src/test/fetch';

describe('method match', () => {
  it('should handle `if` branch', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(method('GET'), tap(yes), tap(no));

    await fetch(app, '/', {
      onNext: next,
    });

    expect(yes).toHaveBeenCalled();
    expect(no).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle `else` branch', async () => {
    const yes = jest.fn();
    const no = jest.fn();
    const next = jest.fn();
    const app = match(method('GET'), tap(yes), tap(no));

    await fetch(app, '/', {
      method: 'POST',
      onNext: next,
    });

    expect(yes).not.toHaveBeenCalled();
    expect(no).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
