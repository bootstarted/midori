import {create} from './util';
export default (method) => create((req) => {
  return req.method === method;
});
