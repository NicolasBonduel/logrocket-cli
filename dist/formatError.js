'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(res) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$verbose = _ref2.verbose,
        verbose = _ref2$verbose === undefined ? false : _ref2$verbose;

    var body, json;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(res.status < 300)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return');

          case 2:

            console.error(res.status + ' ' + res.statusText);

            _context.next = 5;
            return res.text();

          case 5:
            body = _context.sent;


            if (verbose) {
              console.info(body);
            }

            try {
              json = JSON.parse(body);


              if (json.error) {
                console.error(json.error);
              }
            } catch (err) {
              console.error('Could not complete request.');
            }

            process.exit(1);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function formatError(_x) {
    return _ref.apply(this, arguments);
  }

  return formatError;
}();

module.exports = exports['default'];