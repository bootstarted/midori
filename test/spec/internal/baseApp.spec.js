import baseApp from '../../../src/internal/baseApp';

describe('internal/baseApp', () => {
  it('should end the response if not already ended', () => {
    const res = {end: jest.fn()};
    baseApp.request({}, res);
    expect(res.end).toHaveBeenCalled();
  });

  it('should end the response if not already ended', () => {
    const res = {finished: true, end: jest.fn()};
    baseApp.request({}, res);
    expect(res.end).not.toHaveBeenCalled();
  });

  it('should set the status code to 404', () => {
    const res = {finished: false, end: jest.fn()};
    baseApp.request({}, res);
    expect(res.statusCode).toEqual(404);
  });

  it('should not set the status code if headers have been sent', () => {
    const res = {
      finished: false,
      headersSent: true,
      end: jest.fn(),
      statusCode: 200,
    };
    baseApp.request({}, res);
    expect(res.statusCode).toEqual(200);
  });

  it('should provide a default error handler', () => {
    const err = new Error('test');
    baseApp.error(err);
  });

  it('should provide a default upgrade handler', () => {
    const socket = {end: jest.fn()};
    baseApp.upgrade({}, socket);
    expect(socket.end).toHaveBeenCalled();
  });

  it('should not call upgrade handler if one listener', () => {
    const socket = {end: jest.fn()};
    baseApp.listenerCount = () => 1;
    baseApp.upgrade({}, socket);
    expect(socket.end).toHaveBeenCalled();
  });

  it('should not call upgrade handler if other listeners', () => {
    const socket = {end: jest.fn()};
    baseApp.listenerCount = () => 2;
    baseApp.upgrade({}, socket);
    expect(socket.end).not.toHaveBeenCalled();
  });
});
