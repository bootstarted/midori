import { readFileSync } from 'fs';

export default function({ favicon } = { }) {
  const data = readFileSync(favicon);
  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        if (req.url === '/favicon.ico') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/x-icon');
          res.setHeader('Content-Length', data.length);
          res.end(data);
        } else {
          request(req, res);
        }
      },
    };
  };
}
