'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _http = require('http');

var _child_process = require('child_process');

var _url = require('url');

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLI_INDEX = './bin/logrocket';
var FIXTURE_PATH = './test/fixtures/';

var executeCommand = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(cmd) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$env = _ref2.env,
        env = _ref2$env === undefined ? '' : _ref2$env;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve) {
              (0, _child_process.exec)(env + ' ' + CLI_INDEX + ' ' + cmd, function (err, stdout, stderr) {
                resolve({ err: err, stdout: stdout, stderr: stderr });
              });
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function executeCommand(_x) {
    return _ref.apply(this, arguments);
  };
}();

describe('CLI dispatch tests', function cliTests() {
  var _this = this;

  this.timeout(30000);

  var server = void 0;
  var expectRequests = void 0;
  var unmatchedRequests = void 0;
  var matchedRequests = void 0;

  var addExpectRequest = function addExpectRequest(url, opts) {
    expectRequests[url] = (0, _extends3.default)({
      body: {},
      status: 200
    }, opts);
  };

  var addCliStatusMessage = function addCliStatusMessage() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$message = _ref3.message,
        message = _ref3$message === undefined ? '' : _ref3$message,
        _ref3$status = _ref3.status,
        status = _ref3$status === undefined ? 204 : _ref3$status;

    addExpectRequest('/cli/status/', {
      status: status === 204 && message !== '' ? 200 : status,
      body: { message: message }
    });
  };

  var resetRequestCapture = function resetRequestCapture() {
    expectRequests = {};
    unmatchedRequests = [];
    matchedRequests = [];
  };

  before(function () {
    var simplifyRequest = function simplifyRequest(req) {
      var simplifiedRequest = {
        method: req.method,
        body: req.body
      };
      if (req.headers && req.headers.authorization) {
        simplifiedRequest.headers = { authorization: req.headers.authorization };
      }
      return simplifiedRequest;
    };
    server = (0, _http.createServer)(function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var parts, body, req2, request;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                parts = (0, _url.parse)(req.url);

                if (!expectRequests[parts.pathname]) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 4;
                return (0, _rawBody2.default)(req);

              case 4:
                body = _context2.sent;
                req2 = req;


                req2.body = body.toString();
                matchedRequests.push(simplifyRequest(req2));

                request = expectRequests[parts.pathname];


                res.writeHead(request.status, { 'Content-Type': 'application/json' });
                res.write((0, _stringify2.default)(request.body));
                _context2.next = 15;
                break;

              case 13:
                unmatchedRequests.push(req);

                res.writeHead(501, { 'Content-Type': 'application/json' });

              case 15:

                res.end();

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));

      return function (_x4, _x5) {
        return _ref4.apply(this, arguments);
      };
    }());

    server.listen(8818);
  });

  after(function () {
    server.close();
  });

  beforeEach(function () {
    resetRequestCapture();
  });

  it('should show help if no arguments are given', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return executeCommand('');

          case 2:
            result = _context3.sent;

            expect(result.stderr).to.contain('Usage: logrocket');

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }))));

  it('should show help if no command is given', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return executeCommand('-k org:app:key');

          case 2:
            result = _context4.sent;

            expect(result.stderr).to.contain('Usage: logrocket');

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this);
  }))));

  it('should show help for common help flags', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var result1, result2, result3;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return executeCommand('-h');

          case 2:
            result1 = _context5.sent;

            expect(result1.stdout).to.contain('Usage: logrocket');

            _context5.next = 6;
            return executeCommand('--help');

          case 6:
            result2 = _context5.sent;

            expect(result2.stdout).to.contain('Usage: logrocket');

            _context5.next = 10;
            return executeCommand('help');

          case 10:
            result3 = _context5.sent;

            expect(result3.stdout).to.contain('Usage: logrocket');

          case 12:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, _this);
  }))));

  it('should not reveal --apihost in help', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var result;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return executeCommand('--help');

          case 2:
            result = _context6.sent;

            expect(result.stdout).to.not.contain('apihost');

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  }))));

  it('should accept the apikey in various ways', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var result1, result2, result3;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return executeCommand('-k org:app:secret');

          case 2:
            result1 = _context7.sent;

            expect(result1.stderr).to.not.contain('You must provide a LogRocket API key');

            _context7.next = 6;
            return executeCommand('--apikey="org:app:secret"');

          case 6:
            result2 = _context7.sent;

            expect(result2.stderr).to.not.contain('You must provide a LogRocket API key');

            _context7.next = 10;
            return executeCommand('', { env: 'LOGROCKET_APIKEY=org:app:secret' });

          case 10:
            result3 = _context7.sent;

            expect(result3.stderr).to.not.contain('You must provide a LogRocket API key');

          case 12:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, _this);
  }))));

  // RELEASE

  it('should show the release help without errors', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var result2, result3;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return executeCommand('help release');

          case 2:
            result2 = _context8.sent;

            expect(result2.stdout).to.contain('Usage: logrocket release');

            _context8.next = 6;
            return executeCommand('release --help');

          case 6:
            result3 = _context8.sent;

            expect(result3.stdout).to.contain('Usage: logrocket release');

          case 8:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, _this);
  }))));

  it('should show release help with error if no options are passed', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var result;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return executeCommand('release');

          case 2:
            result = _context9.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('Usage: logrocket release');
            expect(result.stderr).to.contain('Missing');

          case 6:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, _this);
  }))));

  it('should error if no release version is passed', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var result;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818"');

          case 2:
            result = _context10.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('Missing release version');

          case 5:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, _this);
  }))));

  it('should send a request to create a release', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var result, req;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 200 });

            _context11.next = 4;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 1.0.3');

          case 4:
            result = _context11.sent;


            expect(result.err).to.be.null();
            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

            req = matchedRequests[1];

            expect(req.method).to.equal('POST');
            expect(req.headers).to.have.property('authorization', 'Token org:app:secret');
            expect(req.body).to.equal('{"version":"1.0.3"}');

          case 12:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, _this);
  }))));

  it('should not convert the release version to a number', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var result, req;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 200 });

            _context12.next = 4;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 81444e2');

          case 4:
            result = _context12.sent;


            expect(result.err).to.be.null();
            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

            req = matchedRequests[1];

            expect(req.method).to.equal('POST');
            expect(req.headers).to.have.property('authorization', 'Token org:app:secret');
            expect(req.body).to.equal('{"version":"81444e2"}');

          case 12:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, _this);
  }))));

  it('should ignore duplicate releases', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var result1, result2;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 200 });

            _context13.next = 4;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 1.0.3');

          case 4:
            result1 = _context13.sent;


            expect(result1.err).to.be.null();
            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

            resetRequestCapture();
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 200 });

            _context13.next = 13;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 1.0.3');

          case 13:
            result2 = _context13.sent;


            expect(result2.err).to.be.null();
            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

          case 17:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, _this);
  }))));

  it('should error on duplicate releases when in strict mode', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    var result1, result2;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 200 });

            _context14.next = 4;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 1.0.3');

          case 4:
            result1 = _context14.sent;


            expect(result1.err).to.be.null();
            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

            resetRequestCapture();
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 409 });

            _context14.next = 13;
            return executeCommand('release -k org:app:secret --strict --apihost="http://localhost:8818" 1.0.3');

          case 13:
            result2 = _context14.sent;


            expect(result2.err.code).to.equal(1);
            expect(result2.stderr).to.contain('Release already exists');

            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

          case 18:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, _this);
  }))));

  it('should error if the server returns a 400', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var result;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 400 });

            _context15.next = 4;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 1.0.3');

          case 4:
            result = _context15.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('Could not create release');

            expect(matchedRequests).to.have.length(2);
            expect(unmatchedRequests).to.have.length(0);

          case 9:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, _this);
  }))));

  // UPLOAD

  it('should show the upload help', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var result2, result3;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return executeCommand('help upload');

          case 2:
            result2 = _context16.sent;

            expect(result2.stdout).to.contain('Usage: logrocket upload');

            _context16.next = 6;
            return executeCommand('upload --help');

          case 6:
            result3 = _context16.sent;

            expect(result3.stdout).to.contain('Usage: logrocket upload');

          case 8:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, _this);
  }))));

  it('should show not show secret options in upload help', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
    var result;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return executeCommand('help upload');

          case 2:
            result = _context17.sent;

            expect(result.stdout).to.not.contain('gcs');

          case 4:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, _this);
  }))));

  it('should show upload help with error if no options are passed', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
    var result;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.next = 2;
            return executeCommand('upload');

          case 2:
            result = _context18.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('Usage: logrocket upload');
            expect(result.stderr).to.contain('Missing');

          case 6:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, _this);
  }))));

  it('should error if no path is provided', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
    var result;
    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.next = 2;
            return executeCommand('upload -k org:app:secret -r 1.0.2 --apihost="http://localhost:8818"');

          case 2:
            result = _context19.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('Missing upload path');

          case 5:
          case 'end':
            return _context19.stop();
        }
      }
    }, _callee19, _this);
  }))));

  it('should error if no release is provided', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
    var result;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return executeCommand('upload -k org:app:secret --apihost="http://localhost:8818" ' + FIXTURE_PATH);

          case 2:
            result = _context20.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('You must specify a release');

          case 5:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, _this);
  }))));

  it('should upload the passed directory', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
    var result;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/1.0.2/artifacts/', {
              status: 200,
              body: { signed_url: 'http://localhost:8818/upload/' }
            });

            addExpectRequest('/upload/', { status: 200 });

            _context21.next = 5;
            return executeCommand('upload -k org:app:secret -r 1.0.2 --apihost="http://localhost:8818" ' + FIXTURE_PATH);

          case 5:
            result = _context21.sent;


            expect(result.err).to.be.null();
            expect(result.stdout).to.contain('Found 3 files');
            expect(matchedRequests).to.have.length(6 + 1);
            expect(unmatchedRequests).to.have.length(0);

            expect(matchedRequests[0].method).to.equal('GET');

            expect(matchedRequests).to.deep.include.members([{
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/subdir/one.js"}'
            }, {
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/two.js.map"}'
            }, {
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/two.jsx"}'
            }, {
              method: 'PUT',
              body: '\'one js contents\';\n'
            }, {
              method: 'PUT',
              body: 'two map contents\n'
            }, {
              method: 'PUT',
              body: '\'two jsx contents\';\n'
            }]);

          case 12:
          case 'end':
            return _context21.stop();
        }
      }
    }, _callee21, _this);
  }))));

  it('should support a custom url prefix', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
    var result;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/1.0.2/artifacts/', {
              status: 200,
              body: { signed_url: 'http://localhost:8818/upload/' }
            });

            addExpectRequest('/upload/', { status: 200 });

            _context22.next = 5;
            return executeCommand('upload -k org:app:secret -r 1.0.2 --apihost="http://localhost:8818" ' + FIXTURE_PATH + ' --url-prefix="~/public"');

          case 5:
            result = _context22.sent;


            expect(result.err).to.be.null();
            expect(result.stdout).to.contain('Found 3 files');
            expect(matchedRequests).to.have.length(6 + 1);
            expect(unmatchedRequests).to.have.length(0);

            expect(matchedRequests[0].method).to.equal('GET');

            expect(matchedRequests).to.deep.include.members([{
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/public/subdir/one.js"}'
            }, {
              method: 'PUT',
              body: '\'one js contents\';\n'
            }, {
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/public/two.js.map"}'
            }]);

          case 12:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, _this);
  }))));

  it('should upload the passed file', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
    var result, _matchedRequests, _matchedRequests2, s, r1, u1;

    return _regenerator2.default.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/1.0.2/artifacts/', {
              status: 200,
              body: { signed_url: 'http://localhost:8818/upload/' }
            });

            addExpectRequest('/upload/', { status: 200 });

            _context23.next = 5;
            return executeCommand('upload -k org:app:secret -r 1.0.2 --apihost="http://localhost:8818" ' + FIXTURE_PATH + 'subdir/one.js');

          case 5:
            result = _context23.sent;


            expect(result.err).to.be.null();
            expect(result.stdout).to.contain('Found 1 file');
            expect(matchedRequests).to.have.length(3);
            expect(unmatchedRequests).to.have.length(0);

            _matchedRequests = matchedRequests, _matchedRequests2 = (0, _slicedToArray3.default)(_matchedRequests, 3), s = _matchedRequests2[0], r1 = _matchedRequests2[1], u1 = _matchedRequests2[2];

            expect(s.method).to.equal('GET');

            expect(r1.method).to.equal('POST');
            expect(r1.headers).to.have.property('authorization', 'Token org:app:secret');
            expect(r1.body).to.equal('{"filepath":"~/one.js"}');

            expect(u1.method).to.equal('PUT');
            expect(u1.body).to.equal('\'one js contents\';\n');

          case 17:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, _this);
  }))));

  it('should upload the passed files', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
    var result;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            addCliStatusMessage();
            addExpectRequest('/v1/orgs/org/apps/app/releases/1.0.2/artifacts/', {
              status: 200,
              body: { signed_url: 'http://localhost:8818/upload/' }
            });

            addExpectRequest('/upload/', { status: 200 });

            _context24.next = 5;
            return executeCommand('upload -k org:app:secret -r 1.0.2 --apihost="http://localhost:8818" ' + FIXTURE_PATH + 'subdir/one.js ' + FIXTURE_PATH + 'two.jsx');

          case 5:
            result = _context24.sent;


            expect(result.err).to.be.null();
            expect(result.stdout).to.contain('Found 2 files');
            expect(matchedRequests).to.have.length(5);
            expect(unmatchedRequests).to.have.length(0);

            expect(matchedRequests[0].method).to.equal('GET');

            expect(matchedRequests).to.deep.include.members([{
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/one.js"}'
            }, {
              method: 'PUT',
              body: '\'one js contents\';\n'
            }, {
              method: 'POST',
              headers: {
                authorization: 'Token org:app:secret'
              },
              body: '{"filepath":"~/two.jsx"}'
            }, {
              method: 'PUT',
              body: '\'two jsx contents\';\n'
            }]);

          case 12:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, _this);
  }))));

  it('should error if the server ping fails', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25() {
    var result;
    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            addCliStatusMessage({ status: 400, message: 'Some error to show' });
            addExpectRequest('/v1/orgs/org/apps/app/releases/', { status: 200 });

            _context25.next = 4;
            return executeCommand('release -k org:app:secret --apihost="http://localhost:8818" 1.0.3');

          case 4:
            result = _context25.sent;


            expect(result.err.code).to.equal(1);
            expect(result.stderr).to.contain('Some error to show');

          case 7:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, _this);
  }))));
});