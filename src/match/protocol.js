// @flow
import {create} from './util';

export default (protocol: string) =>
  create((req) => {
    // TODO: FIXME: Flow seems to think `IncomingMessage` does not have a field
    // called `connection`.
    // $ExpectError
    let proto = req.connection.encrypted ? 'https' : 'http';
    // TODO: Ensure header is from trusted proxy!!.
    proto = req.headers['x-forwarded-proto'] || proto;
    proto = proto.split(/\s*,\s*/)[0];
    return proto === `${protocol}`.replace(/:$/, '');
  });
