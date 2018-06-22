/* @flow */
import compose from './compose';
import request from './request';
import status from './status';
import send from './send';

import type {App} from './types';

type Disposer = () => void;
type TriggerCallback = (a: App) => void;
type Trigger = (c: TriggerCallback) => void | Disposer;
type Options = {
  timeout: number,
  onTimeout: App,
};

const defaultOnTimeout = compose(
  status(500),
  send('Timeout.'),
);

const defaultOptions = {
  timeout: 10000,
  onTimeout: defaultOnTimeout,
};

/**
 * Pending allows you to wait for a given trigger before continuing the
 * request chain. If this condition is not met within the given timeout then
 * the `onTimeout` app is used instead. If the condition is met then the
 * current app can be replaced.
 * @param {Function} trigger Function invoked during the request which is
 * passed a trigger callback. You call this trigger callback whenever you
 * are ready to continue the request.
 * @param {Object} options Options to control pending behaviour.
 * @param {Number} options.timeout How long to wait before timing out.
 * @param {Object} options.onTimeout App to use when timeout occurs.
 * @returns {App} App instance.
 */
const pending = (trigger: Trigger, options: Options = defaultOptions): App => {
  const {
    timeout = defaultOptions.timeout,
    onTimeout = defaultOptions.onTimeout,
  } = options;
  return request(
    (req) =>
      new Promise((resolve) => {
        let disposer = null;
        const dispose = () => {
          if (disposer) {
            disposer();
            disposer = null;
          }
        };
        const timer = setTimeout(() => {
          dispose();
          resolve(onTimeout);
        }, timeout);
        const fn = (newApp) => {
          clearTimeout(timer);
          dispose();
          resolve(newApp);
        };
        disposer = trigger(fn);
        req.on('close', dispose);
      }),
  );
};

export default pending;
