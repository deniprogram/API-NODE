'use strict';

var expect = require('expect.js');
var TokenService = require('../../app/services/token');
var assert = require('assert');

describe('Tokens', function() {
    it('Generate token', function() {
        const tokenService = new TokenService();
        tokenService.generateToken({
            id: 1
        }, function(valid, model) {
            tokenService.validToken({
                body: {
                    token: model
                }
            }, function(valid, model) {
                assert.equal(1, model.id);
            });
        });
    });

    it('Valid token', function() {
        const tokenService = new TokenService();
        tokenService.generateToken({
            id: 19
        }, function(valid, model) {
            tokenService.validToken({
                body: {
                    token: model
                }
            }, function(valid_token, model_token) {
                assert.equal(model.id, model_token.id);
            });
        });
    });
});
