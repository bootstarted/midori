import {guard, create} from './util';

export default (method) => {
  const g = guard(method);
  return create((req) => {
    return g(req.method);
  });
};
