'use strict';
var jwt = require('jsonwebtoken');
var fs = require('fs-extra');
var _constants = require('../../constants');

class TokenService {
  generateToken(data, cb) {
      jwt.sign(data, fs.readFileSync(_constants.KEY_CRYP), {
          algorithm: 'HS256'
      }, function(err, token) {
          if (err) {
              cb(false, err);
          } else {
              cb(true, token);
          }
      });
  }

  validToken(token, cb) {
      if (token) {
          jwt.verify(token, fs.readFileSync(_constants.KEY_CRYP), function(err, decoded) {
              if (err) {
                  cb(false, {
                      token: false
                  });
              } else {
                  cb(true, decoded);
              }
          });
      } else {
          cb(false, {
              token: false
          });
      }
  }
}

module.exports = TokenService;
