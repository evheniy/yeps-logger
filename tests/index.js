const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const Router = require('yeps-router');
const logger = require('..');
const storage = require('../logger');
const expect = chai.expect;

chai.use(chaiHttp);
let app, router;

describe('YEPS logger test', () => {

    beforeEach(() => {
        app = new App();
        app.all([
            error(),
            logger(),
        ]);
        router = new Router();
    });

    it('should test access from middleware', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            expect(ctx.logger).is.not.undefined;
            isTestFinished1 = true;

            ctx.res.writeHead(200);
            ctx.res.end('test');
        });

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.text).to.be.equal('test');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test access from router', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        router.catch().then(async ctx => {
            expect(ctx.logger).is.not.undefined;
            isTestFinished1 = true;

            ctx.res.writeHead(200);
            ctx.res.end('test');
        });

        app.then(router.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .then(res => {
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

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test middleware with resolve', async () => {
        let isTestFinished = false;

        app.then(() => Promise.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                expect(err.message).to.be.equal('Not Found');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test storage', async () => {

        storage.info('test');

    });

    it('should test access from middleware for production', async () => {
        process.env.NODE_ENV = 'production';
        delete require.cache[require.resolve('../logger')];
        require('../logger');

        let isTestFinished1 = false;
        let isTestFinished2 = false;

        app.then(async ctx => {
            expect(ctx.logger).is.not.undefined;
            isTestFinished1 = true;

            ctx.res.writeHead(200);
            ctx.res.end('test');
        });

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .then(res => {
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

        router.catch().then(async ctx => {
            expect(ctx.logger).is.not.undefined;
            isTestFinished1 = true;

            ctx.res.writeHead(200);
            ctx.res.end('test');
        });

        app.then(router.resolve());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .then(res => {
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

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
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

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
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
