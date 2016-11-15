import compose from 'lodash/flowRight';
import http from 'http';
import method from './method';
import path from './path';
import match from '../match';

const verbs = {};

http.METHODS.map(verb => {
  verbs[verb.toLowerCase()] = (prefix, ...middleware) =>
    match(compose(method(verb), path(prefix)), compose(...middleware));
});

verbs.all = (prefix, ...middleware) =>
  match(path(prefix), compose(...middleware));

export default verbs;
