var express = require("express");
var router = express.Router();
var https = require('https');
const epitechintra_get = require("../../data/db.js").epitechintra_get;
const epitechintra_update = require("../../data/db.js").epitechintra_update;
const epitechintra_delete = require("../../data/db.js").epitechintra_delete;
const isJSONEmpty = require("../../data/tools.js").isJSONEmpty;

const getIntraData = (token) => {
    return new Promise((resolve, reject) => {
        https.get("https://intra.epitech.eu/" + token + "/user/?format=json", (resp) => {
            resp.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        })
    });
}

var epitechIntraData = async (req) => {
    var epitechIntraToken = await epitechintra_get(req.session.username, req.session.username_id);
    // console.log(epitechIntraToken)
    if (!epitechIntraToken.epitechintra_token)
        return (null);
    var epitechIntraData = await getIntraData(epitechIntraToken.epitechintra_token);
    var data = {
        name : epitechIntraData.firstname + " " + epitechIntraData.lastname,
        mail : epitechIntraData.internal_email,
        semester : epitechIntraData.semester,
        year: (epitechIntraData.studentyear == null) ? 0 : epitechIntraData.studentyear,
        promo: epitechIntraData.promo,
        first_group : (isJSONEmpty(epitechIntraData.groups) == true) ? "" : epitechIntraData.groups[0].title,
        log : (isJSONEmpty(epitechIntraData.nsstat) == true) ? 0 : epitechIntraData.nsstat.active,
        gpa: (isJSONEmpty(epitechIntraData.gpa) == true) ? 0 : epitechIntraData.gpa[0].gpa,
        credits: epitechIntraData.credits,
        absences : (isJSONEmpty(epitechIntraData.events)) ? 0: epitechIntraData.events.length
    };
    return (data);
}

exports.epitechIntraData = epitechIntraData;

const checkToken = async (token) => {
    var epitechIntraData = await getIntraData(token);
    if (epitechIntraData.login)
        return (true);
    return (false);
};

router.post('/', async (req, res, next) => {
    var token = req.body.selectEpitechToken;
    token = token.replace("https://intra.epitech.eu/", "");
    if (await checkToken(token))
        await epitechintra_update(req.session.username, req.session.username_id, token);
    res.redirect('/home');
})

router.get('/disconnect', async (req, res, next) => {
    await epitechintra_delete(req.session.username, req.session.username_id);
    res.redirect('/home');
})

exports.router = router;