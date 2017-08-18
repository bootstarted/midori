import request from './request';
import pure from './pure';
import match from './match';
import path from './match/path';

// TODO: Implement me.
export default () => match(
  path('/.well-known/acme-challenge/:acme'),
  request(() => {
    return pure();
  })
);
