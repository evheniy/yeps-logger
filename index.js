const debug = require('debug')('yeps:logger');
const logger = require('./logger');

module.exports = () => async (context) => {
  debug('Logger creating...');

  context.logger = logger;

  if (!context.app.hasUserErrorLogger) {
    debug('Registering user error logger...');

    context.app.hasUserErrorLogger = true;

    context.app.then(async (ctx) => {
      debug('Running user error logger...');

      ctx.logger.info(ctx.req.url);
    });
  }

  if (!context.app.hasServerErrorLogger) {
    debug('Registering server error logger...');

    context.app.hasServerErrorLogger = true;

    context.app.catch(async (err, ctx) => {
      debug('Running server error logger...');
      debug('Error:', err);

      debug('Logging error...');
      ctx.logger.error(err);
    });
  }
};
