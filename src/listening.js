// @flow
import type {Server} from 'http';
import type {App} from './types';
type Listening = (server: Server) => void | (() => void);

export default (listener: Listening) => (app: App) => {
  return {
    ...app,
    listening() {
      listener(this);
      app.listening(this);
    },
  };
};
