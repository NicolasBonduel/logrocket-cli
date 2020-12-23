'use strict';

var _require = require('./commands/release'),
    releaseHandler = _require.handler;

var _require2 = require('./commands/upload'),
    uploadHandler = _require2.handler;

module.exports = { release: releaseHandler, upload: uploadHandler };