var express = require('express');
var router = express.Router();

const redirectIfNotConnected = require('../data/tools.js').redirectIfNotConnected;

router.get('/', (req, res) => {
    if (redirectIfNotConnected(req, res))
        return;
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;