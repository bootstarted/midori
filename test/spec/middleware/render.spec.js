import { expect } from 'chai';
import sinon from 'sinon';

import renderMiddleware from '../../../src/middleware/render';

describe('render', () => {
  let next;
  let store;
  let result;
  let createStore;
  let render;
  let error;
  let request;
  let req;
  let res;
  let err;
  let app;

  beforeEach(() => {
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
    store = { };
    result = { };
    createStore = sinon.spy(() => store);
    render = sinon.spy(() => result);
    request = sinon.spy();
    error = sinon.spy();
    req = { };
    res = { };
    err = new Error();
    app = renderMiddleware({ createStore, render, request, error })(next);
  });

  describe('with a request', () => {
    it('it should call request', () => {
      app.request(req, res);
      expect(request).to.have.been.calledWith(req, res, store);
    });

    it('should call render', (done) => {
      app.request(req, res).then(() => {
        expect(render).to.have.been.calledWith(req, res, store);
        done();
      });
    });

    it('it should call next request', (done) => {
      app.request(req, res).then(() => {
        expect(next.request).to.have.been.calledWith(req, res);
        done();
      });
    });
  });

  describe('with an error', () => {
    it('it should call error', () => {
      app.error(req, res, err);
      expect(error).to.have.been.calledWith(req, res, err, store);
    });

    it('it should call next request', (done) => {
      app.error(err, req, res).then(() => {
        expect(next.request).to.have.been.calledWith(req, res);
        done();
      });
    });
  });

  it('should attach result returned from render to req', () => {
    app.request(req, res).then(() => {
      expect(req.render).to.equal(result);
      expect(req.body).to.equal(result.markup);
    });
  });
});
