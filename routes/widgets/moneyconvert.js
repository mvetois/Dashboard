var express = require("express");
var router = express.Router();
var https = require('https');

const getExchangeValue = () => {
    return new Promise((resolve, reject) => {
        https.get("https://api.exchangeratesapi.io/latest?symbols=USD,CAD,GBP,AUD,CNY,JPY,RUB,INR", (resp) => {
            resp.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        })
    });
}

var exchangeValue = async (amount) => {
    var values = await getExchangeValue();
    var date = values.date.split('-');
    var data = {
        date: date[2] + "-" + date[1] + "-" + date[0],
        base: values.base,
        amount: amount,
        USD: Math.round(values.rates.USD * amount * 100) / 100,
        CAD: Math.round(values.rates.CAD * amount * 100) / 100,
        AUD: Math.round(values.rates.AUD * amount * 100) / 100,
        GBP: Math.round(values.rates.GBP * amount * 100) / 100,
        CNY: Math.round(values.rates.CNY * amount * 100) / 100,
        JPY: Math.round(values.rates.JPY * amount * 100) / 100,
        RUB: Math.round(values.rates.RUB * amount * 100) / 100,
        INR: Math.round(values.rates.INR * amount * 100) / 100
    };
    // console.log(data);
    return (data);
}

exports.exchangeValue = exchangeValue;
