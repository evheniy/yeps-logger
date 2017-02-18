const App = require('yeps');
const error = require('yeps-error');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const Router = require('yeps-router');
const logger = require('..');
// const expect = chai.expect;

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

    it('should test middleware');
    it('should test router');
    it('should test middleware');

});
