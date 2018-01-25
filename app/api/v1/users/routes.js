'use strict';
const UserBusiness = require('./business');

module.exports = function (router, db, const_status_http) {

    var user = new UserBusiness(db);

    router.post('/', user.create.bind(user));
    router.get('/:id', user.index.bind(user));
    router.put('/', user.update.bind(user));

    router.post('/login', (req, res, next) => {
        user.login(req.body).then((result) => {
            res.status(const_status_http.success).json({
                data: result
            });
        }).catch((error) => {
            next(error);
        });
    });

    return router;
};
