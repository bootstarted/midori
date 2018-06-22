// @flow
import Negotiator from 'negotiator';
import {request, send, createSelector, listen, apply} from '../src';

const negotiator = createSelector(request, (req) => new Negotiator(req));

const language = (languages) =>
  createSelector(negotiator, (n) => n.language(languages));
const mediaType = (mediaTypes = ['*/*']) =>
  createSelector(negotiator, (n) => n.mediaType(mediaTypes));

const app = apply(
  language(['en-US', 'en-CA']),
  mediaType(['text/html']),
  (language, mediaType) => {
    return send(200, `Got language: ${language} and media type: ${mediaType}.`);
  },
);

listen(app, 8080);
