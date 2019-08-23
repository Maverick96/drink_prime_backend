// dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//authorization
const auth = require('../auth/verify');

// models
const models = require('../models');
const user = models.User;
const UserToken = models.UserToken;
// constants
const keys = require('../config/keys');
const columns = ["email", "name", "password"];
// create Users
router.post('/create', (req, res, next) => {

    // only create user if password and email was sent
    if (req.body.email !== undefined && req.body.password !== undefined) {
        // hash the password before storing it
        bcrypt.hash(req.body.password, keys.saltRounds)
            .then(hash => {
                let userObj = {};
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i] === 'password') {
                        userObj['password'] = hash;
                    } else {
                        userObj[columns[i]] = req.body[columns[i]];
                    }
                }
                return user.create(userObj)
            })
            .then(user => {
                res.json({
                    success: true,
                    message: 'Admin created'
                });
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    } else {
        res.json({
            success: false,
            msg: 'Email/Password not valid'
        });
    }
});

router.post('/verify', (req, res, next) => {
    let userDetails = {};
    user.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            userDetails = (user !== null) ? user.dataValues : null;
            // console.log(userDetails)
            if (userDetails === null)
                throw new Error('User not found');
            else if (!userDetails.isBlocked)
                return bcrypt.compare(req.body.password, user.dataValues.password);
        })
        .then(isSame => {
            if (isSame) {
                const payload = {
                    name: userDetails.name,
                    email: req.body.email,
                    userId: userDetails.userId
                }

                jwt.sign(payload, keys.secret, (err, token) => {
                    if (err) {
                        return next(err);
                    }

                    res.json({
                        token,
                        data: {
                            name: userDetails.name,
                            email: userDetails.email
                        },
                        success: true
                    })

                    UserToken.create({
                        token: token,
                        userId: userDetails.userId
                    })

                })
            } else {
                res.json({
                    msg: "Incorrect password/email",
                    success: false
                });

            }
        })
        .catch(err => {
            console.error(err)
            next(err);
        })

});


module.exports = router;