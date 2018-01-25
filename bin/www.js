'use strict';

const app = require('../app');
const models = require("../db/models");
const path = require('path');
const _config = require(path.join(__dirname, '..', 'config', 'application.json'));

app.set('port', process.env.PORT || _config.application.port);

models.sequelize.sync().then(function() {
    const server = app.listen(app.get('port'), function() {
        console.log('------------------ RUN APPLICATION ------------------');
        console.log('PORT: ', server.address().port);
    });
});
