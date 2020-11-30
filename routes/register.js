var express = require("express");
var router = express.Router();

const register = require("../data/db.js").register

router.post('/', async (req, res, next) => {
    var usr = req.body.inputUserRegister;
    var psw = req.body.inputPasswordRegister;
    if (!usr || !psw)
        return res.render('register', { error: "Nom d'utilisateur ou mot de passe incomplet"});
    const rest = await register(usr, psw);
    if (rest == "ko") {
        return (res.render("register", { error: "L'utilisateur ' " + usr + " ' existe déjà !" }));
    } else {
        return res.render('login', { success: "Utilisateur créer", error: null });
    }
})

router.get('/', (req, res, next) => {
    return res.render('register', { error: null });
});

module.exports = router;