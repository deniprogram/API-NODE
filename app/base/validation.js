'use strict';
var _ = require('lodash');
var _constants = require('../../constants');

class BaseValidation {

  email(email) {
    const expressionEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return expressionEmail.test(email);
  }

}

module.exports = BaseValidation;
