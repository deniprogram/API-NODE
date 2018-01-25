const path = require('path');

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

define("KEY_CRYP", path.join(__dirname, 'keys', 'token'));

define("HTTP_STATUS", {
    success: 200,
    bad_request: 400,
    unauthorized: 401,
    not_found: 404,
});
