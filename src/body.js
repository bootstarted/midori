// @flow
import createError from 'http-errors';
import getBody from 'raw-body';
import zlib from 'zlib';
import parseContentType from 'content-type-parser';

import createSelector from './createSelector';
import request from './request';

import type {IncomingMessage} from 'http';
import type {Readable} from 'stream';

const contentstream = (req: IncomingMessage, inflate?: boolean): Readable => {
  const encoding = (
    req.headers['content-encoding'] || 'identity'
  ).toLowerCase();
  let stream;

  if (inflate === false && encoding !== 'identity') {
    throw createError(415, `unsupported content encoding "${encoding}"`, {
      encoding: encoding,
      type: 'encoding.unsupported',
    });
  }

  switch (encoding) {
    case 'deflate':
      stream = zlib.createInflate();
      req.pipe(stream);
      break;
    case 'gzip':
      stream = zlib.createGunzip();
      req.pipe(stream);
      break;
    case 'identity':
      stream = req;
      break;
    default:
      throw createError(415, `unsupported content encoding "${encoding}"`, {
        encoding: encoding,
        type: 'encoding.unsupported',
      });
  }

  return stream;
};

type Options = {
  encoding?: string,
  inflate?: boolean,
  limit?: number,
  stream?: boolean,
};

const isParsed: WeakMap<IncomingMessage, boolean> = new WeakMap();

export const withOptions = (options: Options = {}) =>
  createSelector(
    request,
    async (req): Promise<string | Buffer | Readable> => {
      if (isParsed.has(req)) {
        throw createError(500, 'Body already read.');
      }
      const bodyOptions = {
        encoding: options.encoding,
        limit: options.limit,
      };
      const type = parseContentType(req.headers['content-type']);
      const charset = type && type.get('charset');
      if (
        typeof charset === 'string' &&
        charset.length > 0 &&
        typeof options.encoding === 'undefined'
      ) {
        bodyOptions.encoding = charset;
      }
      const stream = contentstream(req, options.inflate);
      isParsed.set(req, true);
      if (options.stream === true) {
        return stream;
      }
      return await getBody(stream, bodyOptions);
    },
  );

/**
 * @tag http
 * @desc Do the thing.
 */
const body = withOptions();
body.withOptions = withOptions;

export default body;
