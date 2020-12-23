'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _apiClient = require('../apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('CLI apiClient tests', function () {
  var client = void 0;

  beforeEach(function () {
    client = (0, _apiClient2.default)({
      apikey: 'org:app:key',
      apihost: 'http://example.com'
    });
  });

  afterEach(function () {
    _fetchMock2.default.restore();
  });

  it('should send a request to create a release', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var opts;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _fetchMock2.default.post('http://example.com/v1/orgs/org/apps/app/releases/', function () {
              return 200;
            });
            _context.next = 3;
            return client.createRelease({ version: '1.0.2' });

          case 3:

            expect(_fetchMock2.default.calls().matched).to.have.length(1);
            expect(_fetchMock2.default.calls().unmatched).to.have.length(0);

            opts = _fetchMock2.default.lastCall()[1];

            expect(opts.headers).to.have.property('Authorization', 'Token org:app:key');
            expect(opts.body).to.equal('{"version":"1.0.2"}');

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }))));

  it('should send a request to fetch an upload url', mochaAsync((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var tt, gCloud;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _fetchMock2.default.post('http://example.com/v1/orgs/org/apps/app/releases/1.0.2/artifacts/', function () {
              return { signed_url: 'http://example.com/upload' };
            }, { name: 'troytown' });

            _fetchMock2.default.put('http://example.com/upload', function () {
              return 200;
            }, { name: 'gcloud' });

            _context2.next = 4;
            return client.uploadFile({
              release: '1.0.2',
              filepath: '~/path.js',
              contents: 'stuff!'
            });

          case 4:

            expect(_fetchMock2.default.calls().matched).to.have.length(2);
            expect(_fetchMock2.default.calls().unmatched).to.have.length(0);

            tt = _fetchMock2.default.lastOptions('troytown');

            expect(tt.headers).to.have.property('Authorization', 'Token org:app:key');
            expect(tt.body).to.equal('{"filepath":"~/path.js"}');

            gCloud = _fetchMock2.default.lastOptions('gcloud');

            expect(gCloud.body).to.equal('stuff!');

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }))));
});