import {create} from './util';

export default (protocol) => create((request) => {
  let proto = request.connection.encrypted ? 'https' : 'http';
  // TODO: Ensure header is from trusted proxy!!.
  proto = request.headers['x-forwarded-proto'] || proto;
  proto = proto.split(/\s*,\s*/)[0];
  return proto === `${protocol}`.replace(/:$/, '');
});
