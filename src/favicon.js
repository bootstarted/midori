import { readFileSync } from 'fs';

// TODO: Change to a generic "send"-style function. Takes a single input
// url and maps it to single output file. File can be a local file (in which
// case contents are sent), otherwise can be a url in which case redirect is
// sent. The `favicon` is then just specific instance of `send`.
export default function({ favicon } = { }) {
  const data = readFileSync(favicon);
  return function(app) {
    const { request } = app;
    return {
      ...app,
      request(req, res) {
        if (req.url === '/favicon.ico') {
          res.statusCode = 200;
          // http://stackoverflow.com/questions/13827325
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
