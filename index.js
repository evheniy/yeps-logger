const debug = require('debug')('yeps:logger');
const logger = require('./logger');

module.exports = () => async (context) => {
  debug('Logger created');

  context.logger = logger;

  context.app.catch(async (err, ctx) => {
    debug('Register 500 error handler');
    debug(err);

    if (err) {
      ctx.logger.error(err);
    }
  });

  context.app.then(async (ctx) => {
    debug('Register request logger');

    ctx.logger.info(ctx.req.url);
  });
};
