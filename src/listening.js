// @flow
import type {Server} from 'http';
import type {App} from './types';
type Listening = (server: Server) => void | (() => void);

/**
 * Invoke a function whenever the app is connected to a server and that server
 * is already listening or starts listening.
 * @param {Function} listener Function to call.
 * @returns {App} App instance.
 */
export default (listener: Listening): App => (base) => {
  return {
    ...base,
    listening() {
      listener(this);
      base.listening(this);
    },
  };
};
