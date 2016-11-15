import isString from 'lodash/isString';
import isRegExp from 'lodash/isRegExp';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import some from 'lodash/some';
import map from 'lodash/map';

export const combine = (app, match) => {
  if (!app.matches) {
    return match;
  }
  return (req, res) => app.matches(req, res) && match(req, res);
};

export const create = (match) => (app) => {
  return {
    ...app,
    matches: combine(app, match),
  };
};

export const guard = (hosts) => {
  if (isString(hosts)) {
    return (val) => val === hosts;
  } else if (isRegExp(hosts)) {
    return (val) => hosts.exec(val);
  } else if (isFunction(hosts)) {
    return hosts;
  } else if (isArray(hosts)) {
    const guards = map(hosts, guard);
    return (val) => some(guards, (x) => x(val));
  }
  throw new TypeError();
};
