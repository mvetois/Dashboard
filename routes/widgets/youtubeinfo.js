var express = require("express");
var router = express.Router();
var https = require('https');
const getValue = (token, id) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "youtube.googleapis.com",
            path: "/youtube/v3/channels?part=snippet,statistics&id=" + id + "&key=712123902422-ovc9l15t1duq260flk5ul9k5igmbd148.apps.googleusercontent.com",
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
const googleGetChannel = require("../../data/db.js").googleGetChannel;

exports.getYoutubeInfo = async(id) => {
    var token = await googleGetToken(id);
    var channel = await googleGetChannel(id);
    // console.log(token);
    var r = await getValue(token, channel);
    // var r = await getValue(token, "UCYiTZ3LY5T-HaO3ww1KLXJg");
    r = JSON.parse(r);
    if (!r.pageInfo || r.pageInfo.totalResults != 1)
        return ("N/A");
    // console.log(r.items[0]);
    const x = r.items[0];
    if (r.error)
        return ("ko");
    if (r.items.length == 0)
        return (null);
    var data = {
        img: x.snippet.thumbnails.high,
        title: x.snippet.title,
        description: x.snippet.description,
        stats: x.statistics
    }
    return (data);
};

const googleSetChannel = require("../../data/db.js").googleSetChannel;


router.post('/', async (req, res, next) => {
    var url = req.body.selectyoutubeinfo;
    const token = url.replace("https://www.youtube.com/channel/", "");
    await googleSetChannel(req.session.username_id, token);
    res.redirect('/home');
})

exports.router = router;