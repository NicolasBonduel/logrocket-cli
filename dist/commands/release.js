'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.describe = exports.command = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _apiClient = require('../apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

var _formatError = require('../formatError');

var _formatError2 = _interopRequireDefault(_formatError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = exports.command = 'release <version>';
var describe = exports.describe = 'Create a new release';
var builder = exports.builder = function builder(args) {
  args.usage('\nUsage: logrocket release [--strict] <version>').option('strict', {
    type: 'bool',
    describe: 'Fail on duplicate releases',
    default: false
  }).string('_').demand(1, 'Missing release version: e.g. logrocket release 1.2.3').help();
};

var handler = exports.handler = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var version = _ref2.version,
        strict = _ref2.strict,
        apikey = _ref2.apikey,
        apihost = _ref2.apihost,
        verbose = _ref2.verbose;
    var client, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (version) {
              _context.next = 2;
              break;
            }

            throw new Error('Missing release version');

          case 2:
            if (apikey) {
              _context.next = 4;
              break;
            }

            throw new Error('Missing api key');

          case 4:

            console.info('Creating release: ' + version + ' ...');

            client = (0, _apiClient2.default)({ apikey: apikey, apihost: apihost });
            _context.next = 8;
            return client.checkStatus();

          case 8:
            _context.next = 10;
            return client.createRelease({ version: version });

          case 10:
            res = _context.sent;


            if (strict && res.status === 409) {
              console.error('Release already exists. Choose a unique name or call without --strict.');
              process.exit(1);
            }

            if (!(!res.ok && res.status !== 409)) {
              _context.next = 16;
              break;
            }

            console.error('Could not create release: ' + version);
            _context.next = 16;
            return (0, _formatError2.default)(res, { verbose: verbose });

          case 16:

            console.info('Success!');

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function handler(_x) {
    return _ref.apply(this, arguments);
  };
}();