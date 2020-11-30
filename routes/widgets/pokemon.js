var express = require("express");
var router = express.Router();
var https = require('https');
const getValue = (id) => {
    return new Promise((resolve, reject) => {
        var r = "";
        https.get("https://pokeapi.co/api/v2/pokemon/" + id, (resp) => {
            resp.on('data', (d) => {
                r += d;
            });
            resp.on('end', () => {
                resolve(r);
            })
        })
    });
}

const googleGetToken = require("../../data/db.js").googleGetToken;
const getPokemon = require("../../data/db.js").getPokemon;

exports.getPokemonInfo = async(usr, id) => {
    var idPokemon = await getPokemon(usr, id);
    var r = await getValue(idPokemon);
    // console.log(idPokemon);
    // console.log(r);
    r = JSON.parse(r);
    if (!r)
        return (null);
    var data = {
        id: idPokemon,
        name: r.name,
        weight: r.weight,
        height: r.height,
        img: r.sprites.front_default
    };
    return (data);
};

const setPokemon = require("../../data/db.js").setPokemon;


router.post('/', async (req, res, next) => {
    var id = req.body.selectPokemon;
    if (id >= 200)
        id = 200;
    else if (id <= 0)
        id = 1;
    // console.log(id);
    await setPokemon(req.session.username, req.session.username_id, id);
    res.redirect('/home');
})

exports.router = router;