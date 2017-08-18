import request from './request';

// TODO: Implement me. Short timeout in dev env.
export default () => request((req, res, next) => {
  // req.socket.setTimeout();
  // setTimeout(() => {
  //
  // }, 3000);
  return next;
});
