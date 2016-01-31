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
