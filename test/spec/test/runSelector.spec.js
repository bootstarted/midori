import createSelector from '../../../src/createSelector';
import request from '../../../src/request';
import runSelector from '../../../src/test/runSelector';

describe('/test/runSelector', () => {
  it('should mock dependencies', async () => {
    const sel = createSelector(request, (req) => req.status);
    const result = await runSelector(sel, (env) => {
      env.mockValue(request, {status: 101});
    });
    expect(result).toEqual(101);
  });
  it('should fail on non-selectors', async () => {
    await expect(runSelector(5)).rejects.toThrow(TypeError);
  });
  it('should basic', async () => {
    const sel = createSelector(() => 101);
    const result = await runSelector(sel);
    expect(result).toEqual(101);
  });
});
