var express = require("express");
var router = express.Router();
var https = require('https');
const meteo_get = require("../../data/db.js").meteo_get;
const meteo_edit = require("../../data/db.js").meteo_edit;

const getMeteoData = (city, country) => {
    return new Promise((resolve, reject) => {
        https.get("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric", (resp) => {
            resp.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        })
    });
}

var widgetMeteo = async (req) => {
    var meteoData = await meteo_get(req.session.username, req.session.username_id);
    var meteo = await getMeteoData(meteoData.meteo_city, meteoData.meteo_country);
    return ({meteoData: meteoData, meteo: meteo});
}

exports.widgetMeteo = widgetMeteo;

router.post('/', async (req, res, next) => {
    var city = req.body.selectMeteoCity;
    var country = "fr";
    await meteo_edit(req.session.username, req.session.username_id, city, country);
    res.redirect('/home');
})

exports.router = router;