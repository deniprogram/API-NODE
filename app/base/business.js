var _constants = require('../../constants');

class BaseBusiness {
  constructor(db, resource) {
    this.db = db;

    if (resource) {
      this.model = db.sequelize.model(resource);
    }
  }

  beforeCreate(data) {
    return new Promise((resolve, reject) => {
          resolve(data);
    });
  };

  afterCreate(data) {
    return new Promise((resolve, reject) => {
          resolve(data);
    });
  };

  create(req, res, next) {
    this.beforeCreate(req.body)
    .then((dataBefore) => {
      this.model
      .create(dataBefore)
      .then(dataCreate => {
        dataCreate.body = req.body;
        this.afterCreate(dataCreate)
        .then((dataAfter) => {
          res
          .status(_constants.HTTP_STATUS.success)
          .json({ data: dataAfter });
        })
        .catch((error) => {

          this.model.destroy({
              where: {
                  id: dataCreate.id
              }
          });

          next(error);
        });
      })
      .catch(error => {
        next(this.handleError(error));
      });
    })
    .catch(error => {
      next(error);
    });
  }

  index(req, res, next) {
    this.model.findOne({
        where: [`id = ${req.params.id}`]
    })
    .then((response) => {
      res
        .status(_constants.HTTP_STATUS.success)
        .json({ data: response });
    }).catch((error) => {
      next(error);
    });
  }

  beforeUpdate(data) {
    return new Promise((resolve, reject) => {
          resolve(data);
    });
  };

  update(req, res, next) {
    this.beforeUpdate(req.body)
    .then((dataBefore) => {
      this.model.update(dataBefore, {
          where: {
              id: req.body.id
          },
          individualHooks: true
      }).then((response) => {
          res
          .status(_constants.HTTP_STATUS.success)
          .json({ data: response });
      }).catch((error) => {
          next(error);
      });
    }).catch((error) => {
        next(error);
    });
  }

  delete(req, res, next) {
    this.model.destroy({
        where: {
            id: req.params.id
        }
    }).then((response) => {
        res
        .status(_constants.HTTP_STATUS.success)
        .json({ data: response });
    }).catch((error) => {
        next(error);
    });
  }

  /*********************/
  /* RESPONSE ERRORS REQUEST
  /*********************/

  forbidden(message) {
      let errorMessage = message || 'Forbidden';
      return this._errorReponse(403, errorMessage);
  }

  notFound(message) {
      let errorMessage = message || 'Resource not found';
      return this._errorReponse(404, errorMessage);
  }

  unauthorized(message) {
      let errorMessage = message || 'Missing token or invalid token';
      return this._errorReponse(401, errorMessage);
  }

  unprocessableEntity(message) {
      let errorMessage = message || 'Invalid credentials or missing parameters';
      return this._errorReponse(422, errorMessage);
  }

  handleError(error) {
      let message = error.message || 'Undefined error';

      let errorList = _.get(error, 'errors');

      if (_.isEmpty(errorList) === false) {
          let errorMessageList = _.map(errorList, errorItem => {
              return errorItem.message || 'Undefined error';
          });

          message = errorMessageList.toString();
      }

      let nameStatusMap = {
          'SequelizeUniqueConstraintError': 409
      };

      let status = nameStatusMap[error.name];

      console.log("Tra: ", error);
      return this._errorReponse(status, message);
  }

  _errorReponse(status, message) {
      let error = new Error();
      error.status = status || 400;
      error.message = message || 'Bad request';
      return error;
  }
}

module.exports = BaseBusiness;
