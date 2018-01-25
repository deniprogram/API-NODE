'use strict';
const BaseBusiness = require('../../../base/business');
const BaseValidation = require('../../../base/validation');
const bcrypt = require('bcrypt-nodejs');
const TokenService = require('../../../services/token');
const EmailService = require('../../../services/email/index');
const Utils = require('../../../helpers/utils');
const utils = new Utils();
const validation = new BaseValidation();
const moment = require('moment');

class UserBusiness extends BaseBusiness {
    constructor(db) {
        super(db, 'User');
    }

    beforeCreate(data) {
      return new Promise((resolve, reject) => {
        if (!validation.email(data.email)) {
            reject(this.unprocessableEntity('E-mail invalido'));
        } else {
            resolve(data);
        }
      });
    }

    beforeUpdate(data) {
      return new Promise((resolve, reject) => {
        if (!validation.email(data.email)) {
            reject(this.unprocessableEntity('E-mail invalido'));
        } else if(data.password && (data.password != data.confirm_password)) {
            delete data.password;
            reject(this.unprocessableEntity('Confirmação de senha incorreta'));
        } else if(data.password == "") {
            delete data.password;
            resolve(data);
        } else {
            resolve(data);
        }
      });
    }

    login(data) {
        const tokenService = new TokenService();

        return new Promise((resolve, reject) => {
            this.db.User.findOne({
                where: [`email = '${data.email}'`]
            })
            .then((data_user) => {
                if (data_user) {
                    this._auth(data.password, data_user.dataValues.password)
                        .then(() => {
                            tokenService.generateToken(data_user.dataValues, function(valid, model) {
                                valid ? resolve({
                                    token: model,
                                    user: data_user
                                }) : reject(model);
                            });
                        }).catch((error) => {
                            reject(error);
                        });
                } else {
                    reject(this.notFound('E-mail não encontrado'));
                }
            }).catch((error) => {
                reject(error);
            })
        });
    }

    _auth(password, cryptPassword) {
        return new Promise((resolve, reject) => {
            if (bcrypt.compareSync(password, cryptPassword)) {
                resolve()
            } else {
                reject();
            }
        });
    }
}

module.exports = UserBusiness;
