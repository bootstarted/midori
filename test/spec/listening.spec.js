import listening from '../../src/listening';

describe('/request', () => {
  it('should call the next handler in sequence', () => {
    const spy = jest.fn();
    const app = listening(() => {
      return;
    })({listening: spy});
    app.listening();
    expect(spy).toHaveBeenCalled();
  });
});
