var express = require("express");
var router = express.Router();
var https = require('https');
const { exchange_edit, exchange_get } = require("../../data/db");

const getActualValue = (symbols, base) => {
    return new Promise((resolve, reject) => {
        https.get("https://api.exchangeratesapi.io/latest?symbols=" + symbols + "&base=" + base, (resp) => {
            resp.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        })
    });
}

const getDatesValue = (date, symbols, base) => {
    return new Promise((resolve, reject) => {
        https.get("https://api.exchangeratesapi.io/history?start_at=" + date + "&end_at=" + date + "&symbols=" + symbols + "&base=" + base, (resp) => {
            resp.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        })
    });
}

var exchangeDiffValues = async (req) => {
    var r = await exchange_get(req.session.username, req.session.username_id);
    var symbol = r.exchange_value;
    var base = r.exchange_base;
    var actual = await getActualValue(symbol, base);
    var date = new Date();
    date.setDate(date.getDate() - 7);
    var d = String(date.getFullYear()) + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    var week = await getDatesValue(d, symbol, base)
    date.setDate(date.getDate() - 21);
    var dm = String(date.getFullYear()) + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0')
    var month = await getDatesValue(dm, symbol, base)
    var data = {
        base: base,
        symbol: symbol,
        today: actual.rates[symbol],
        week : week.rates[d][symbol],
        month: month.rates[dm][symbol],
    };
    // console.log(data);
    return (data);
}

exports.exchangeDiffValues = exchangeDiffValues;


router.post('/', async (req, res, next) => {
    var base = req.body.selectExchangeBase;
    var value = req.body.selectExchangeValue;
    if (base != value)
        await exchange_edit(req.session.username, req.session.username_id, base, value);
    res.redirect('/home');
})

exports.router = router;