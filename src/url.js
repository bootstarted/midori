// @flow
import request from './request';
import createSelector from './createSelector';
import url from 'parseurl';

import type {IncomingMessage} from 'http';

export default createSelector(
  request,
  (req: IncomingMessage): URL => {
    const out = url(req);
    const host = req.headers.host || '';
    out.host = host;
    const [hostname, port] = host.split(':');
    out.hostname = hostname;
    out.port = port;
    // TODO: FIXME: Flow seems to think `IncomingMessage` does not have a field
    // called `connection`.
    // $ExpectError
    out.protocol = req.connection.encrypted ? 'https' : 'http';
    // TODO: Ensure header is from trusted proxy!!.
    // TODO: Replace match proto code to use this
    out.protocol = req.headers['x-forwarded-proto'] || out.protocol || '';
    out.protocol = out.protocol.split(/\s*,\s*/)[0];
    out.protocol = `${out.protocol}:`;
    // $ExpectError
    out.slashes = true;
    // $ExpectError
    out.href = `${out.protocol}//${out.host}${out.path}`;
    out.origin = req.headers.origin;
    return out;
  },
);
