'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.describe = exports.command = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var gatherFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(paths) {
    var _this = this;

    var map;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            map = [];
            _context2.next = 3;
            return _promise2.default.all(paths.map(function (path) {
              var realPath = (0, _path.join)((0, _process.cwd)(), path);

              if ((0, _fs.statSync)(realPath).isFile()) {
                map.push({
                  path: realPath,
                  name: (0, _path.basename)(realPath)
                });

                return _promise2.default.resolve();
              }

              return new _promise2.default(function (resolve) {
                (0, _glob2.default)('**/*.{js,jsx,js.map}', { cwd: realPath }, function () {
                  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(err, files) {
                    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file;

                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 3;

                            for (_iterator = (0, _getIterator3.default)(files); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                              file = _step.value;

                              map.push({
                                path: (0, _path.join)(realPath, file),
                                name: file
                              });
                            }

                            _context.next = 11;
                            break;

                          case 7:
                            _context.prev = 7;
                            _context.t0 = _context['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = _context.t0;

                          case 11:
                            _context.prev = 11;
                            _context.prev = 12;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                              _iterator.return();
                            }

                          case 14:
                            _context.prev = 14;

                            if (!_didIteratorError) {
                              _context.next = 17;
                              break;
                            }

                            throw _iteratorError;

                          case 17:
                            return _context.finish(14);

                          case 18:
                            return _context.finish(11);

                          case 19:
                            resolve();

                          case 20:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this, [[3, 7, 11, 19], [12,, 14, 18]]);
                  }));

                  return function (_x2, _x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());
              });
            }));

          case 3:
            return _context2.abrupt('return', map);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function gatherFiles(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _path = require('path');

var _process = require('process');

var _fs = require('fs');

var _apiClient = require('../apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

var _formatError = require('../formatError');

var _formatError2 = _interopRequireDefault(_formatError);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = exports.command = 'upload <paths..>';
var describe = exports.describe = 'Upload JavaScript sourcemaps for a release';
var builder = exports.builder = function builder(args) {
  args.usage('\nUsage: logrocket upload -r <release> <paths..>').option('r', {
    alias: 'release',
    type: 'string',
    describe: 'The release version for these files',
    demand: 'You must specify a release, use -r or --release'
  }).option('p', {
    alias: 'urlPrefix',
    type: 'string',
    default: '~/',
    describe: 'Sets a URL prefix in front of all files. Defaults to "~/"'
  }).demand(1, 'Missing upload path: e.g. logrocket upload -r 1.2.3 dist/').option('gcs-token', { // for testing, pass the webhook token to get an immediate pending=no
    type: 'string',
    describe: false
  }).option('gcs-bucket', { // for testing, pass the webhook bucket to get an immediate pending=no
    type: 'string',
    describe: false
  }).implies({
    'gcs-token': 'gcs-bucket',
    'gcs-bucket': 'gcs-token'
  }).help('help');
};

var handler = exports.handler = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(args) {
    var release, apikey, apihost, verbose, _args$urlPrefix, urlPrefix, paths, client, uploadFile, fileList, CHUNK_SIZE, i;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            release = args.release, apikey = args.apikey, apihost = args.apihost, verbose = args.verbose, _args$urlPrefix = args.urlPrefix, urlPrefix = _args$urlPrefix === undefined ? '' : _args$urlPrefix;
            paths = args.paths;

            if (release) {
              _context4.next = 4;
              break;
            }

            throw new Error('Missing release version');

          case 4:
            if (paths) {
              _context4.next = 6;
              break;
            }

            throw new Error('Missing paths');

          case 6:
            if (apikey) {
              _context4.next = 8;
              break;
            }

            throw new Error('Missing api key');

          case 8:
            if (typeof paths === 'string') {
              paths = [paths];
            }

            console.info('Preparing to upload sourcemaps for release ' + release + ' ...');
            console.info('Gathering file list...');

            client = (0, _apiClient2.default)({ apikey: apikey, apihost: apihost });
            _context4.next = 14;
            return client.checkStatus();

          case 14:

            if (args['gcs-token']) {
              client.setGCSData({
                gcsToken: args['gcs-token'],
                gcsBucket: args['gcs-bucket']
              });
            }

            uploadFile = function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref5) {
                var path = _ref5.path,
                    name = _ref5.name;
                var filepath, data, res;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        console.info('Uploading: ' + name);

                        filepath = urlPrefix.replace(/\/$/, '') + '/' + name;
                        data = {
                          release: release,
                          filepath: filepath,
                          contents: (0, _fs.createReadStream)(path)
                        };
                        _context3.prev = 3;
                        _context3.next = 6;
                        return client.uploadFile(data);

                      case 6:
                        res = _context3.sent;

                        if (res.ok) {
                          _context3.next = 11;
                          break;
                        }

                        console.error('Failed to upload: ' + name);
                        _context3.next = 11;
                        return (0, _formatError2.default)(res, { verbose: verbose });

                      case 11:
                        _context3.next = 17;
                        break;

                      case 13:
                        _context3.prev = 13;
                        _context3.t0 = _context3['catch'](3);

                        console.error(_context3.t0.message);
                        process.exit(1);

                      case 17:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined, [[3, 13]]);
              }));

              return function uploadFile(_x5) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context4.next = 18;
            return gatherFiles(paths);

          case 18:
            fileList = _context4.sent;


            console.info('Found ' + fileList.length + ' file' + (fileList.length === 1 ? '' : 's') + ' ...');

            CHUNK_SIZE = 10;
            i = 0;

          case 22:
            if (!(i < fileList.length)) {
              _context4.next = 28;
              break;
            }

            _context4.next = 25;
            return _promise2.default.all(fileList.slice(i, i + CHUNK_SIZE).map(uploadFile));

          case 25:
            i += CHUNK_SIZE;
            _context4.next = 22;
            break;

          case 28:

            console.info('Success!');

          case 29:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function handler(_x4) {
    return _ref3.apply(this, arguments);
  };
}();