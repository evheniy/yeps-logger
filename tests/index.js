const App = require('yeps');
const errorHandler = require('yeps-error');
const chai = require('chai');
const axios = require('axios');
const srv = require('yeps-server');
const Router = require('yeps-router');
const httpAdapter = require('axios/lib/adapters/http');
const logger = require('..');

const { expect } = chai;

const host = `http://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

let app;
let router;
let server;


describe('YEPS logger test', () => {
  const { warn, error } = console;

  beforeEach(() => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
    console.warn = () => 1;
    console.error = () => 1;
  });

  afterEach(() => {
    console.warn = warn;
    console.error = error;
    server.close();
  });

  it('should test access from middleware', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      expect(ctx.logger).to.be.not.equal(undefined);
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await axios.get(host)
      .then(({ data: body, status }) => {
        expect(status).to.be.equal(200);
        expect(body).to.be.equal('test');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).to.be.equal(true);
    expect(isTestFinished2).to.be.equal(true);
  });

  it('should run 3 times', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;
    let isTestFinished4 = false;

    app.then(async (ctx) => {
      expect(ctx.logger).to.be.not.equal(undefined);
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await axios.get(host)
      .then(({ data: body, status }) => {
        expect(status).to.be.equal(200);
        expect(body).to.be.equal('test');
        isTestFinished2 = true;
      });

    await axios.get(host)
      .then(({ data: body, status }) => {
        expect(status).to.be.equal(200);
        expect(body).to.be.equal('test');
        isTestFinished3 = true;
      });

    await axios.get(host)
      .then(({ data: body, status }) => {
        expect(status).to.be.equal(200);
        expect(body).to.be.equal('test');
        isTestFinished4 = true;
      });

    expect(isTestFinished1).to.be.equal(true);
    expect(isTestFinished2).to.be.equal(true);
    expect(isTestFinished3).to.be.equal(true);
    expect(isTestFinished4).to.be.equal(true);
  });

  it('should test access from router', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    router.catch().then(async (ctx) => {
      expect(ctx.logger).to.be.not.equal(undefined);
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    app.then(router.resolve());

    await axios.get(host)
      .then(({ data: body, status }) => {
        expect(status).to.be.equal(200);
        expect(body).to.be.equal('test');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).to.be.equal(true);
    expect(isTestFinished2).to.be.equal(true);
  });

  it('should test middleware', async () => {
    let isTestFinished = false;
    let isTestFinished2 = false;

    console.error = () => {
      isTestFinished2 = true;
    };

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host)
      .catch(({ response: { status, data: body, statusText } }) => {
        expect(status).to.be.equal(500);
        expect(statusText).to.be.equal('Internal Server Error');
        expect(body).to.be.equal('test');
        isTestFinished = true;
      });

    expect(isTestFinished).to.be.equal(true);
    expect(isTestFinished2).to.be.equal(true);
  });

  it('should test middleware with resolve', async () => {
    let isTestFinished = false;
    let isTestFinished2 = false;

    console.warn = () => {
      isTestFinished2 = true;
    };

    app.then(() => Promise.resolve());

    await axios.get(host)
      .catch(({ response: { status, data: body } }) => {
        expect(status).to.be.equal(404);
        expect(body).to.be.equal('Not Found');
        isTestFinished = true;
      });

    expect(isTestFinished).to.be.equal(true);
    expect(isTestFinished2).to.be.equal(true);
  });
});
