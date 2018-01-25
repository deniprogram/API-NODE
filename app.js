_ = require('lodash');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const _config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'application.json'), 'utf8'));
const TokenService = require('./app/services/token');
const _constants = require('./constants');
const app = express();
const models = require('./db/models');
const token = new TokenService();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(logger('combined', { stream: accessLogStream }))
app.use(logger('dev'))

app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {

    const paramRequest = req.body || req.params;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, token");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');

    const token_request = req.headers.token;
    req.token = token_request;

    if (isRoutesWithPermission(req.method, req.url)) {
        console.info("======================= PARAMS REQUEST =======================  \n", paramRequest);
        return next();
    } else {
        if (req.method == "OPTIONS") {
            res.json({});
        }

        if (req.method == "DELETE" || req.method == "PUT" || req.method == "POST" || req.method == "GET") {
            console.info("======================= PARAMS REQUEST =======================  \n", paramRequest);

            token.validToken(token_request, function(result, model) {
                if (!result) {
                    res.status(_constants.HTTP_STATUS.unauthorized).json(model);
                } else {
                    return next();
                }
            });
        }
    }
});

function startRoutes(version) {
    let path_route = path.resolve(__dirname, 'app', 'api', version);
    let exist_directory = fs.existsSync(path_route);

    if (exist_directory) {
        fs.readdirSync(path_route)
            .filter((directory) => {
                return directory;
            })
            .forEach((directory) => {
                var rout = require(path.resolve(path_route, directory, 'routes'))(express.Router(), models, _constants.HTTP_STATUS);
                app.use('/' + version + '/' + directory, rout);
            });
    } else {
        console.log('----VERSION NOT EXIST----', version);
    }
}

// ROUTES WITH PERMISSION FREE
function isRoutesWithPermission(method, url) {
    const routes = [{
        method: 'POST',
        url: '/v1/users/login'
    }, {
        method: 'POST',
        url: '/v1/users'
    }];

    const searchRoute = _.filter(routes, function(route) {
        return route.url == url & route.method == method;
    });

    return searchRoute.length > 0;
}

// START ROUTES
let load_versions = _config.application.load_versions;
_.forEach(load_versions, (version) => {
    let name_version = `v${version}`;
    startRoutes(name_version);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(_constants.HTTP_STATUS.bad_request)
    .json({ message: 'Not Found' });
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((error, req, res, next) => {
    console.error("======================= ERROR ======================= \n", error);
    res.status(error.status || _constants.HTTP_STATUS.bad_request).json({
        data: error
    });
});

module.exports = app;
