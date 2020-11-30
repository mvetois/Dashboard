var express = require("express");
var router = express.Router();
var https = require('https');
const getExchangeValue = (token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "youtube.googleapis.com",
            path: "/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=1&myRating=dislike&key=712123902422-ovc9l15t1duq260flk5ul9k5igmbd148.apps.googleusercontent.com",
            headers: {
                "Authorization": "Bearer "+token
            }
        }
        var r = "";
        https.get(options, (resp) => {
            resp.on('data', (d) => {
                r += d;
                // resolve(d);
            });
            resp.on('end', () => {
                resolve(r);
            })
        })
    });
}

const googleGetToken = require("../../data/db.js").googleGetToken;
const getDislikeIndex = require("../../data/db.js").getDislikeIndex;
const setDislikeIndex = require("../../data/db.js").setDislikeIndex;

exports.getYoutubeDislike = async(id) => {
    var token = await googleGetToken(id);
    // console.log(token);
    var r = await getExchangeValue(token);
    r = JSON.parse(r);
    // console.log(r);
    if (r.error)
        return ("ko");
    if (r.items.length == 0)
        return (null);
    var nb = await getDislikeIndex(id);
    while (!r.items[nb]) {
        nb--;
    }
    var data = {
        img: r.items[nb].snippet.thumbnails.maxres || r.items[nb].snippet.thumbnails.standard ,
        title: r.items[nb].snippet.title,
        author: r.items[nb].snippet.channelTitle,
        stats: r.items[nb].statistics,
        i: nb + 1
    }
    return (data);
};

router.get('/add', async (req, res, next) => {
    var nb = Number(await getDislikeIndex(req.session.username_id));
    nb++;
    if (nb > 2)
        nb = 0;
    await setDislikeIndex(req.session.username_id, nb);
    res.redirect('/home');
})

router.get('/rem', async (req, res, next) => {
    var nb = Number(await getDislikeIndex(req.session.username_id));
    nb--;
    if (nb < 0)
        nb = 2;
    await setDislikeIndex(req.session.username_id, nb);
    res.redirect('/home');
})

exports.router = router;