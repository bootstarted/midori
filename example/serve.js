// @flow
import {get, serve, compose, listen} from '../src';

const app = compose(get('/foo', serve({root: __dirname})));

listen(app, 8080);
