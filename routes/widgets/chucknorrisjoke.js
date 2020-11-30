var express = require("express");
var router = express.Router();
var https = require('https');

const getCNJoke = require("../../data/db.js").getCNJoke;
const setCNJoke = require("../../data/db.js").setCNJoke;

const getValue = (query) => {
    return new Promise((resolve, reject) => {
        var r = "";
        if (!query || query == "") {
            https.get("https://api.chucknorris.io/jokes/random", (resp) => {
                resp.on('data', (d) => {
                    r += d;
                });
                resp.on('end', () => {
                    resolve(r);
                })
            });
        } else {
            https.get("https://api.chucknorris.io/jokes/search?query=" + query, (resp) => {
                resp.on('data', (d) => {
                    r += d;
                });
                resp.on('end', () => {
                    resolve(r);
                })
            });
        }
    });
}


exports.getChuckNorisJoke = async(req) => {
    var value = await getCNJoke(req.session.username, req.session.username_id);
    var r = await getValue(value);
    r = JSON.parse(r);

    var data = [];
    if (!r.total) {
        data.push(r.value);
    } else {
        for (var i = 0; i < r.total && i < 3; i++) {
            data.push(r.result[i].value)
        }
    }
    return (data);
};


router.post('/', async (req, res, next) => {
    var value = req.body.selectQueryJoke;
    if (value != "" && value != null)
        await setCNJoke(req.session.username, req.session.username_id, value);
    else
        await setCNJoke(req.session.username, req.session.username_id, null);
    res.redirect('/home');
})

exports.router = router;