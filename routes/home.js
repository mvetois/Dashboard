var express = require("express");
var router = express.Router();

const redirectIfNotConnected = require('../data/tools.js').redirectIfNotConnected;
const meteoListCity = require("../public/data/meteoCity.json")
const ev = require("../public/data/exchangeValue.json")

const checkGoogle = require("../data/db.js").checkGoogle;

const widgetMeteo = require("./widgets/meteo.js").widgetMeteo;
const epitechIntraData = require("./widgets/epitechintra.js").epitechIntraData;
const exchangeValue = require("./widgets/moneyconvert.js").exchangeValue;
const getYoutubeLike = require("./widgets/youtubelike.js").getYoutubeLike;
const getYoutubeDisike = require("./widgets/youtubedislike.js").getYoutubeDislike;
const getYoutubeInfo = require("./widgets/youtubeinfo.js").getYoutubeInfo;
const getChuckNorisJoke = require("./widgets/chucknorrisjoke.js").getChuckNorisJoke;
const getPokemonInfo = require("./widgets/pokemon.js").getPokemonInfo;

const exchangeDiffValues = require("./widgets/moneyhistory.js").exchangeDiffValues;

const meteo = require("./widgets/meteo.js").router;
router.use('/meteo', meteo);

const epitechintra = require("./widgets/epitechintra.js").router;
router.use('/epitechintra', epitechintra);

const moneyhistory = require("./widgets/moneyhistory.js").router;
router.use('/exchange', moneyhistory);

const youtubelike = require("./widgets/youtubelike.js").router;
router.use('/like', youtubelike);

const youtubedislike = require("./widgets/youtubedislike.js").router;
router.use('/dislike', youtubedislike);

const youtubeinfo = require("./widgets/youtubeinfo.js").router;
router.use('/youtubeinfo', youtubeinfo);

const cnjoke = require("./widgets/chucknorrisjoke.js").router;
router.use('/cnjoke', cnjoke);

const poke = require("./widgets/pokemon.js").router;
router.use('/pokemon', poke);

router.get('/', async (req, res, next) => {
    if (redirectIfNotConnected(req, res))
        return;
    var meteo = await widgetMeteo(req);
    var epitechIntra = await epitechIntraData(req);
    var exchangeMoney = await exchangeValue(1);
    var googleCheck = await checkGoogle(req.session.username_id);
    var a = null;
    var youtubeLastLike = googleCheck == "ok" ? await getYoutubeLike(req.session.username_id) : null;
    var youtubeLastDislike = googleCheck == "ok" ? await getYoutubeDisike(req.session.username_id) : null;
    var youtubeInfo = await getYoutubeInfo(req.session.username_id);
    if (youtubeLastLike == "ko" || youtubeLastDislike == "ko" || youtubeInfo == "ko") {
        res.redirect("/disconnect");
        return;
    }
    var exchangehistory = await exchangeDiffValues(req);
    var cnJoke = await getChuckNorisJoke(req);
    var pokemon = await getPokemonInfo(req.session.username, req.session.username_id)
    res.render('home', { error: null, username: req.session.username, meteo: meteo.meteo, meteo_list : meteoListCity , meteo_selected: meteo.meteoData.meteo_city, epitechIntra : epitechIntra, exchangeMoney: exchangeMoney, youtubeLastLike: youtubeLastLike,youtubeLastDislike:youtubeLastDislike, youtubeInfo:youtubeInfo, exchangehistory: exchangehistory, exchangeValue: ev, cnJoke:cnJoke, pokemon:pokemon});
    return;
});

module.exports = router;