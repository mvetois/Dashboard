const config = require("./config.js");
const pool = config.config.pool;

var register = async (usr, psw) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE USERNAME = $1", [usr]);
    if (rows.length != 0)
        return ("ko");
    await pool.query("INSERT INTO USERS(username, password, meteo_city, meteo_country, exchange_base, exchange_value, like_index, dislike_index, pokemon) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);", [usr, psw, "Paris", "fr", "EUR", "USD", 0, 0, "1"]);
    return ("ok");
};

exports.register = register;

var login = async (usr, psw) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE USERNAME = $1 AND PASSWORD = $2", [usr, psw]);
    // console.log(rows);
    if (rows.length == 0)
        return ("ko");
    if (rows[0].google_id)
        return ("ko");
    return (rows[0].id)
};

exports.login = login;

var google_login = async (id, token) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE GOOGLE_ID = $1", [id]);
    if (rows.length != 0) {
        if (rows[0].google_token != token)
            await pool.query("UPDATE USERS SET google_token = $2 WHERE GOOGLE_ID = $1", [id, token]);
        return;
    } else {
        await pool.query("INSERT INTO USERS(google_token, google_id, meteo_city, meteo_country, exchange_base, exchange_value, like_index, dislike_index, pokemon) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);", [token, id, "Paris", "fr", "EUR", "USD", 0, 0, "1"]);
    }
    return;
};

exports.google_login = google_login;

var googleGetToken = async (id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE GOOGLE_ID = $1", [id]);
    return(rows[0].google_token);
}
exports.googleGetToken = googleGetToken;

var checkGoogle = async (id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE GOOGLE_ID = $1", [id]);
    if (rows.length != 0)
        return ("ok");
    return ("ko");
};
exports.checkGoogle = checkGoogle;

var googleGetChannel = async (id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE GOOGLE_ID = $1", [id]);
    return(rows[0].google_channel);
}
exports.googleGetChannel = googleGetChannel;

var googleSetChannel = async (id, token) => {
    await pool.query("UPDATE USERS SET google_channel = $2 WHERE GOOGLE_ID = $1", [id, token]);
    return;
};

exports.googleSetChannel = googleSetChannel;

var meteo_get = async (usr, id) => {
    const { rows } = await pool.query("SELECT meteo_city, meteo_country FROM USERS WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0]);
};

exports.meteo_get = meteo_get;

var meteo_edit = async (usr, id, city, country) => {
    await pool.query("UPDATE USERS SET meteo_city = $3, meteo_country = $4 WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id, city, country]);
    return;
};

exports.meteo_edit = meteo_edit;

var epitechintra_get = async (usr, id) => {
    const { rows } = await pool.query("SELECT epitechintra_token FROM USERS WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0]);
};

exports.epitechintra_get = epitechintra_get;

var epitechintra_update = async (usr, id, token) => {
    await pool.query("UPDATE USERS SET epitechintra_token = $3 WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id, token]);
    return;
};

exports.epitechintra_update = epitechintra_update;

var epitechintra_delete = async (usr, id) => {
    await pool.query("UPDATE USERS SET epitechintra_token = $3 WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id, null]);
    return;
};

exports.epitechintra_delete = epitechintra_delete;

var exchange_edit = async (usr, id, base, value) => {
    await pool.query("UPDATE USERS SET exchange_base = $3, exchange_value = $4 WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id, base, value]);
    return;
};

exports.exchange_edit = exchange_edit;

var exchange_get = async (usr, id) => {
    const { rows } = await pool.query("SELECT exchange_base, exchange_value FROM USERS WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0]);
};
exports.exchange_get = exchange_get;

exports.setCNJoke = async (usr, id, value) => {
    await pool.query("UPDATE USERS SET cn_joke = $3 WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id, value]);
    return;
};

exports.getCNJoke = async (usr, id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0].cn_joke);
};

exports.getLikeIndex = async (id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE GOOGLE_ID = $1", [id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0].like_index);
};

exports.getDislikeIndex = async (id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE GOOGLE_ID = $1", [id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0].dislike_index);
};

exports.setLikeIndex = async (id, value) => {
    await pool.query("UPDATE USERS SET like_index = $2 WHERE GOOGLE_ID = $1", [id, value]);
    return;
};

exports.setDislikeIndex = async (id, value) => {
    await pool.query("UPDATE USERS SET dislike_index = $2 WHERE GOOGLE_ID = $1", [id, value]);
    return;
};

exports.getPokemon = async (usr, id) => {
    const { rows } = await pool.query("SELECT * FROM USERS WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id]);
    if (rows.length == 0)
        return ("ko");
    return (rows[0].pokemon);
};

exports.setPokemon = async (usr, id, value) => {
    await pool.query("UPDATE USERS SET pokemon = $3 WHERE USERNAME = $1 OR GOOGLE_ID = $2", [usr, id, value]);
    return;
};