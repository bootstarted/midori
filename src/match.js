
export default function(match, yes, no = (x) => x) {
  return function(_app) {
    const app = match(_app);
    const { request: ya } = yes(app);
    const { request: na } = no(app);
    return {
      ..._app,
      request(req, res) {
        if (app.matches(req, res)) {
          ya(req, res);
        } else {
          na(req, res);
        }
      },
    };
  };
}
