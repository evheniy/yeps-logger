const debug = require('debug')('yeps:logger');
const winston = require('winston');
const config = require('config');
const transports = [];

transports.push(new (winston.transports.Console)({
    level: 'info',
    json: false,
    timestamp: true,
    colorize: true,
    prettyPrint: true,
    showLevel: true
}));

transports.push(new winston.transports.File(Object.assign({ level: 'error' }, config.logger)));

module.exports = () => async context => {
    debug(config.logger);
    context.logger = new (winston.Logger)({
        transports: transports,
        exceptionHandlers: transports,
        exitOnError: false,
    });

    context.app.catch(async (err, ctx) => {
        debug('Register 500 error handler');
        debug(err);
        ctx.logger.error(err);
    });

    context.app.then(async ctx => {
        debug('Register request logger');
        ctx.logger.info(ctx.req.url);
    });
};
