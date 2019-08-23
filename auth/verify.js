const jwt = require('jsonwebtoken');
const secret = require('../config/keys').secret;
const UserToken = require('../models').UserToken;
function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, secret, (err, authData) => {
            if (err) {
                err = new Error("Authentication failed");
                err.status = 403;
                next(err);
            }
            req.token = bearerToken;
            req.authData = authData;
            UserToken.findAll({
                where: {
                    token: bearerToken
                }
            }).then(userToken => {
                console.log(userToken);

                if (userToken.length === 0) {
                    err = new Error("logout");
                    err.status = 401;
                    return next(err);
                }
            })
                .catch(err => {
                    console.error(err);
                    return next(err)
                })
            next();
        });
    }
    else {
        res.json({
            "Message": "Authentication Failed",
            "status": 403
        });

    }
}


module.exports.verifyToken = verifytoken;
