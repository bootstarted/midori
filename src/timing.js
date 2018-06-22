// @flow
import onHeaders from 'on-headers';
import onFinished from 'on-finished';
import response from './response';
import createSelector from './createSelector';

type Mark = (time?: [number, number]) => [number, number];

let mark: Mark = process.hrtime;

export const setMark = (m: Mark) => (mark = m);

const finish = (then, callback) => {
  const end = mark(then);
  callback(end[0] / 1000 + end[1] / 1000000);
};

export const headers = createSelector(response, (res) => {
  const then = mark();
  return new Promise((resolve) => {
    onFinished(res, () => finish(then, resolve));
    onHeaders(res, () => finish(then, resolve));
  });
});

export const end = createSelector(response, (res) => {
  const then = mark();
  return new Promise((resolve) => {
    onFinished(res, () => finish(then, resolve));
  });
});

const timing = {headers, end};

export default timing;
