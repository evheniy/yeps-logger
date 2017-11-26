const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const srv = require('yeps-server');
const Router = require('yeps-router');
const logger = require('..');
const storage = require('../logger');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let router;
let server;


describe('YEPS logger test', () => {
  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      logger(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should test access from middleware', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      expect(ctx.logger).is.not.undefined;
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should ru 3 times', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;
    let isTestFinished4 = false;

    app.then(async (ctx) => {
      expect(ctx.logger).is.not.undefined;
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished3 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished4 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
    expect(isTestFinished4).is.true;
  });

  it('should test access from router', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    router.catch().then(async (ctx) => {
      expect(ctx.logger).is.not.undefined;
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    app.then(router.resolve());

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test middleware', async () => {
    let isTestFinished = false;

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test middleware with resolve', async () => {
    let isTestFinished = false;

    app.then(() => Promise.resolve());

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test storage info', async () => {
    let isTestFinished = false;

    const { write } = process.stdout;

    process.stdout.write = () => {
      isTestFinished = true;
    };

    storage.info('test');

    process.stdout.write = write;

    expect(isTestFinished).is.true;
  });

  it('should test storage error', async () => {
    let isTestFinished = false;

    const { write } = process.stderr;

    process.stderr.write = () => {
      isTestFinished = true;
    };

    storage.error('test');

    process.stderr.write = write;

    expect(isTestFinished).is.true;
  });

  it('should test access from middleware for production', async () => {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../logger')];
    require('../logger');

    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      expect(ctx.logger).is.not.undefined;
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;

    process.env.NODE_ENV = '';
    delete require.cache[require.resolve('../logger')];
    require('../logger');
  });

  it('should test access from router for production', async () => {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../logger')];
    require('../logger');

    let isTestFinished1 = false;
    let isTestFinished2 = false;

    router.catch().then(async (ctx) => {
      expect(ctx.logger).is.not.undefined;
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    app.then(router.resolve());

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.be.equal('test');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;

    process.env.NODE_ENV = '';
    delete require.cache[require.resolve('../logger')];
    require('../logger');
  });

  it('should test middleware for production', async () => {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../logger')];
    require('../logger');

    let isTestFinished = false;

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;

    process.env.NODE_ENV = '';
    delete require.cache[require.resolve('../logger')];
    require('../logger');
  });

  it('should test middleware with resolve for production', async () => {
    process.env.NODE_ENV = 'production';
    delete require.cache[require.resolve('../logger')];
    require('../logger');

    let isTestFinished = false;

    app.then(() => Promise.resolve());

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;

    process.env.NODE_ENV = '';
    delete require.cache[require.resolve('../logger')];
    require('../logger');
  });
});
