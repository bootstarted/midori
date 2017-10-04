import baseApp from '../internal/baseApp';

export const combine = (app, match) => {
  if (!app.matches) {
    return match;
  }
  return (req, res) => app.matches(req, res) && match(req, res);
};

export const create = (match) => (app = {}) => {
  return {
    ...baseApp,
    ...app,
    matches: combine(app, match),
  };
};

export const guard = (hosts) => {
  if (typeof hosts === 'string') {
    return (val) => val === hosts;
  } else if (hosts instanceof RegExp) {
    return (val) => hosts.exec(val);
  } else if (typeof hosts === 'function') {
    return hosts;
  } else if (Array.isArray(hosts)) {
    const guards = hosts.map(guard);
    return (val) => guards.some((x) => x(val));
  }
  throw new TypeError();
};
