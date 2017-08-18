import {guard, create} from './util';

export default (header, check) => {
  const g = guard(check);
  const v = header.toLowerCase();
  return create((req) => {
    return g(req.headers[v]);
  });
};
