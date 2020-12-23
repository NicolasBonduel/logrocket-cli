'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = apiClient;

require('isomorphic-fetch');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ApiClient = function () {
  function ApiClient(_ref) {
    var apikey = _ref.apikey,
        _ref$apihost = _ref.apihost,
        apihost = _ref$apihost === undefined ? 'https://api.logrocket.com' : _ref$apihost;
    (0, _classCallCheck3.default)(this, ApiClient);

    this.apikey = apikey;
    this.apihost = apihost;
  }

  (0, _createClass3.default)(ApiClient, [{
    key: '_makeRequest',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3) {
        var url = _ref3.url,
            data = _ref3.data;

        var _apikey$split, _apikey$split2, orgSlug, appSlug;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _apikey$split = this.apikey.split(':'), _apikey$split2 = (0, _slicedToArray3.default)(_apikey$split, 2), orgSlug = _apikey$split2[0], appSlug = _apikey$split2[1];
                return _context.abrupt('return', fetch(this.apihost + '/v1/orgs/' + orgSlug + '/apps/' + appSlug + '/' + url + '/', {
                  method: 'POST',
                  headers: this.headers,
                  body: (0, _stringify2.default)(data)
                }));

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _makeRequest(_x) {
        return _ref2.apply(this, arguments);
      }

      return _makeRequest;
    }()
  }, {
    key: 'checkStatus',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var res, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return fetch(this.apihost + '/cli/status/', {
                  headers: this.headers
                });

              case 2:
                res = _context2.sent;

                if (!(res.status === 204)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt('return');

              case 5:
                data = void 0;
                _context2.prev = 6;
                _context2.next = 9;
                return res.json();

              case 9:
                data = _context2.sent;
                _context2.next = 16;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](6);

                console.error('Could not verify CLI status. Check your network connection and reinstall the LogRocket CLI if the problem persists.');
                process.exit(1);

              case 16:

                if (!res.ok) {
                  console.error(data.message);
                  process.exit(1);
                } else {
                  console.info(data.message);
                }

              case 17:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 12]]);
      }));

      function checkStatus() {
        return _ref4.apply(this, arguments);
      }

      return checkStatus;
    }()
  }, {
    key: 'createRelease',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref6) {
        var version = _ref6.version;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', this._makeRequest({
                  url: 'releases',
                  data: { version: version }
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function createRelease(_x2) {
        return _ref5.apply(this, arguments);
      }

      return createRelease;
    }()
  }, {
    key: 'uploadFile',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(_ref8) {
        var release = _ref8.release,
            filepath = _ref8.filepath,
            contents = _ref8.contents;
        var res, fileData, gcloudUrl, result;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._makeRequest({
                  url: 'releases/' + release + '/artifacts',
                  data: { filepath: filepath }
                });

              case 2:
                res = _context4.sent;

                if (res.ok) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt('return', res);

              case 5:
                _context4.next = 7;
                return res.json();

              case 7:
                fileData = _context4.sent;
                gcloudUrl = fileData.signed_url;

                if (gcloudUrl) {
                  _context4.next = 11;
                  break;
                }

                throw new Error('Could not get upload url for: ' + filepath);

              case 11:
                result = fetch(gcloudUrl, {
                  method: 'PUT',
                  body: contents
                });

                if (!this._gcsBucket) {
                  _context4.next = 15;
                  break;
                }

                _context4.next = 15;
                return fetch(this.apihost + '/gcloud/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Channel-Token': this._gcsToken
                  },
                  body: (0, _stringify2.default)({
                    name: fileData.name,
                    bucket: this._gcsBucket
                  })
                });

              case 15:
                return _context4.abrupt('return', result);

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function uploadFile(_x3) {
        return _ref7.apply(this, arguments);
      }

      return uploadFile;
    }()
  }, {
    key: 'setGCSData',
    value: function setGCSData(_ref9) {
      var gcsToken = _ref9.gcsToken,
          gcsBucket = _ref9.gcsBucket;

      this._gcsToken = gcsToken;
      this._gcsBucket = gcsBucket;
    }
  }, {
    key: 'headers',
    get: function get() {
      return {
        Authorization: 'Token ' + this.apikey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-LogRocket-Cli-Version': _package.version
      };
    }
  }]);
  return ApiClient;
}();

function apiClient(config) {
  return new ApiClient(config);
}
module.exports = exports['default'];