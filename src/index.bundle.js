module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _promise = __webpack_require__(1);

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = __webpack_require__(2);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = __webpack_require__(3);

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = __webpack_require__(4);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var aws = __webpack_require__(5);
var s3 = new aws.S3({ apiVersion: '2006-03-01' });
var fs = __webpack_require__(6);
var tar = __webpack_require__(7);
var puppeteer = __webpack_require__(8);
var config = __webpack_require__(9);

var browser = null;
exports.getBrowser = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.t0 = typeof browser === 'undefined';

                        if (_context2.t0) {
                            _context2.next = 5;
                            break;
                        }

                        _context2.next = 4;
                        return isBrowserAvailable(browser);

                    case 4:
                        _context2.t0 = !_context2.sent;

                    case 5:
                        if (!_context2.t0) {
                            _context2.next = 18;
                            break;
                        }

                        if (!(config.localChromePath || config.remoteChromeS3Bucket)) {
                            _context2.next = 14;
                            break;
                        }

                        _context2.next = 9;
                        return setupChrome();

                    case 9:
                        _context2.next = 11;
                        return puppeteer.launch((0, _assign2.default)({
                            headless: true,
                            executablePath: config.executablePath,
                            args: config.launchOptionForLambda,
                            dumpio: !!exports.DEBUG,
                            ignoreHTTPSErrors: true
                        }, options));

                    case 11:
                        browser = _context2.sent;
                        _context2.next = 17;
                        break;

                    case 14:
                        _context2.next = 16;
                        return puppeteer.launch((0, _assign2.default)({
                            dumpio: !!exports.DEBUG,
                            ignoreHTTPSErrors: true
                        }, options));

                    case 16:
                        browser = _context2.sent;

                    case 17:

                        debugLog(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(b) {
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return browser.version();

                                            case 2:
                                                _context.t0 = _context.sent;
                                                return _context.abrupt('return', 'launch done: ' + _context.t0);

                                            case 4:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x2) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                    case 18:
                        return _context2.abrupt('return', browser);

                    case 19:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();

var isBrowserAvailable = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(browser) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return browser.version();

                    case 3:
                        _context3.next = 9;
                        break;

                    case 5:
                        _context3.prev = 5;
                        _context3.t0 = _context3['catch'](0);

                        debugLog(_context3.t0); // not opened etc.
                        return _context3.abrupt('return', false);

                    case 9:
                        return _context3.abrupt('return', true);

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[0, 5]]);
    }));

    return function isBrowserAvailable(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

var setupChrome = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return existsExecutableChrome();

                    case 2:
                        if (_context4.sent) {
                            _context4.next = 15;
                            break;
                        }

                        _context4.next = 5;
                        return existsLocalChrome();

                    case 5:
                        if (!_context4.sent) {
                            _context4.next = 11;
                            break;
                        }

                        debugLog('setup local chrome');
                        _context4.next = 9;
                        return setupLocalChrome();

                    case 9:
                        _context4.next = 14;
                        break;

                    case 11:
                        debugLog('setup s3 chrome');
                        _context4.next = 14;
                        return setupS3Chrome();

                    case 14:
                        debugLog('setup done');

                    case 15:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function setupChrome() {
        return _ref4.apply(this, arguments);
    };
}();

var existsLocalChrome = function existsLocalChrome() {
    return new _promise2.default(function (resolve, reject) {
        fs.exists(config.localChromePath, function (exists) {
            resolve(exists);
        });
    });
};

var existsExecutableChrome = function existsExecutableChrome() {
    return new _promise2.default(function (resolve, reject) {
        fs.exists(config.executablePath, function (exists) {
            resolve(exists);
        });
    });
};

var setupLocalChrome = function setupLocalChrome() {
    return new _promise2.default(function (resolve, reject) {
        fs.createReadStream(config.localChromePath).on('error', function (err) {
            return reject(err);
        }).pipe(tar.x({
            C: config.setupChromePath
        })).on('error', function (err) {
            return reject(err);
        }).on('end', function () {
            return resolve();
        });
    });
};

var setupS3Chrome = function setupS3Chrome() {
    return new _promise2.default(function (resolve, reject) {
        var params = {
            Bucket: config.remoteChromeS3Bucket,
            Key: config.remoteChromeS3Key
        };
        s3.getObject(params).createReadStream().on('error', function (err) {
            return reject(err);
        }).pipe(tar.x({
            C: config.setupChromePath
        })).on('error', function (err) {
            return reject(err);
        }).on('end', function () {
            return resolve();
        });
    });
};

var debugLog = function debugLog(log) {
    if (config.DEBUG) {
        var message = log;
        if (typeof log === 'function') message = log();
        _promise2.default.resolve(message).then(function (message) {
            return console.log(message);
        });
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("tar");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("puppeteer");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var path = __webpack_require__(10);

var launchOptionForLambda = [
// error when launch(); No usable sandbox! Update your kernel
'--no-sandbox',
// error when launch(); Failed to load libosmesa.so
'--disable-gpu',
// freeze when newPage()
'--single-process'];

var localChromePath = path.join(__dirname, '../chrome/headless_shell.tar.gz');
var remoteChromeS3Bucket = process.env.CHROME_BUCKET;
var remoteChromeS3Key = process.env.CHROME_KEY || 'headless_shell.tar.gz';

var setupChromePath = path.join(path.sep, 'tmp');
var executablePath = path.join(setupChromePath, 'headless_shell');

var DEBUG = process.env.DEBUG;

module.exports = {
    launchOptionForLambda: launchOptionForLambda,
    localChromePath: localChromePath,
    remoteChromeS3Bucket: remoteChromeS3Bucket,
    remoteChromeS3Key: remoteChromeS3Key,
    setupChromePath: setupChromePath,
    executablePath: executablePath,
    DEBUG: DEBUG
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })
/******/ ]);