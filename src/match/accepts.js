import Negotiator from 'negotiator';
import {create} from './util';

export default (check) => {
  return create((req) => {
    if (!req.negotiator) {
      req.negotiator = new Negotiator(req);
    }
    return !!req.negotiator.mediaType(check);
  });
};
