'use strict';

let express = require('express');
let router = express.Router();

let autorizator = require('../authorizator');

// GET /login
router.get('/login', function (req, res) {
    let params = {
        error_code: req.query.reason,
        login: req.query.login
    };

    res.render('login', params);
    res.end();
});

// GET /logout
router.get('/logout', function (req, res) {
    res.clearCookie('token');

    res.redirect('/login');
    res.end();
});

// POST /authorize
router.post('/authorize', function (req, res) {

    let week = 24 * 7 * 60 * 60 * 1000;

    let login = req.body.login;
    let password = req.body.pass;

    autorizator
        .authorize(login, password)
        .then(token => {
            res.cookie('token', token, { maxAge: week, httpOnly: true });
            res.redirect('/');
        },
        () => {
            var redirect_url = '/login?reason=invalid_credentials' + (login ? `&login=${login}` : '')
            res.redirect(redirect_url);
        });
});

module.exports = router;