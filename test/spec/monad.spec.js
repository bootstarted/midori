import {expect} from 'chai';
import {compose, assign, request} from '../../src';

// https://github.com/fantasyland/fantasy-land#monad
// TODO: WIP: There's kind of a big-ish issue where the functions are two-arity
// (should be 1) and thus the return value currently would be a tuple of
// [req, res]. JavaScript does not do this very well.
describe('monad', () => {
  describe('chain', () => {
    it('implements associativity', () => {
      const f = (req, _res) => assign({foo: req.statusCode});
      const g = (req, _res) => assign({bar: req.statusCode + 1});
      const m1 = compose(
        request(f),
        request(g),
      );
      const m2 = request((req, res) => {
        return compose(
          f(req, res),
          g
        );
      });
      const req1 = {statusCode: 202};
      const req2 = {statusCode: 202};
      m1().request(req1);
      m2().request(req2);
      expect(req1.foo).to.equal(req2.foo);
      expect(req1.bar).to.equal(req2.bar);
    });
  });
});
