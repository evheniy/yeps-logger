# YEPS async logger


[![NPM](https://nodei.co/npm/yeps-logger.png)](https://npmjs.org/package/yeps-logger)

[![npm version](https://badge.fury.io/js/yeps-logger.svg)](https://badge.fury.io/js/yeps-logger)
[![Build Status](https://travis-ci.org/evheniy/yeps-logger.svg?branch=master)](https://travis-ci.org/evheniy/yeps-logger)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-logger/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-logger?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-logger/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-logger/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-logger)

[![Dependency Status](https://david-dm.org/evheniy/yeps-logger.svg)](https://david-dm.org/evheniy/yeps-logger)
[![devDependency Status](https://david-dm.org/evheniy/yeps-logger/dev-status.svg)](https://david-dm.org/evheniy/yeps-logger#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-logger)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-logger/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-logger.svg)](https://github.com/evheniy/yeps-logger/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-logger.svg)](https://github.com/evheniy/yeps-logger/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-logger.svg)](https://github.com/evheniy/yeps-logger/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-logger.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


## How to install

    npm i -S yeps-logger debug
  
## How to use
    
### Middleware

```javascript
const App = require('yeps');
    
const logger = require('yeps-logger');
const error = require('yeps-error');
    
const app = new App();

app.all([
  error(),
  logger(),
]);
```

You can use any system for logging.
By default it's console.

```javascript
const log4js = require('log4js');

app.all([
  logger(log4js),
]);
```

Try:
* [log4js](https://www.npmjs.com/package/log4js)
* [winston](https://github.com/winstonjs/winston)


#### [YEPS documentation](http://yeps.info/)
