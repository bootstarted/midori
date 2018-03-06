// @flow
import Negotiator from 'negotiator';
import request from './request';
import update from './assign';

import type {AppCreator} from './types';

declare class NegotiatorX {
  mediaType(?Array<string>): string;
  mediaTypes(?Array<string>): Array<string>;
  language(?Array<string>): string;
  languages(?Array<string>): Array<string>;
  charset(?Array<string>): string;
  charsets(?Array<string>): Array<string>;
  encoding(?Array<string>): string;
  encodings(?Array<string>): Array<string>;
}

type Options = {
  mediaTypes: Array<string>,
  languages?: Array<string>,
  charsets?: Array<string>,
  encodings?: Array<string>,
}

export default ({
  mediaTypes = ['*/*'],
  charsets,
  encodings,
  languages,
}: Options): AppCreator =>
  request((req) => {
    const negotiator: NegotiatorX = req.negotiator instanceof Negotiator ?
      req.negotiator : new Negotiator(req);
    const mediaType = negotiator.mediaType(mediaTypes);
    const charset = negotiator.charset(charsets);
    const language = negotiator.language(languages);
    const encoding = negotiator.encoding(encodings);
    return update({
      negotiator,
      mediaType,
      charset,
      language,
      encoding,
    }, null);
  });
