// @flow
import {parse} from 'useragent';
import {request, apply, send, listen, createSelector} from '../src';

const agent = createSelector(request, (req) => {
  return parse(req.headers['user-agent']);
});

const app = apply(agent, (agent) => {
  return send(200, `Got agent: ${agent.toAgent()}`);
});

listen(app, 8080);
