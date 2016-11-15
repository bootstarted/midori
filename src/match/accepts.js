import {guard, create} from './util';

export default (header, check) => {
  const g = guard(check);
  return create((req) => {
    return req.accepts.some(g);
  });
};
