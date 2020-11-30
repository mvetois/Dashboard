var express = require("express");
var router = express.Router();

const login = require("../data/db.js").login
const google_login = require("../data/db.js").google_login

router.post('/', async (req, res, next) => {
    var usr = req.body.inputUserLogin;
    var psw = req.body.inputPasswordLogin;
    if (!usr || !psw)
        return res.render('login', { error: "Nom d'utilisateur ou mot de passe incomplet", success: null });
    const response = await login(usr, psw)
    if (response == "ko") {
        return (res.render('login', { error: "Mauvais nom d'utilisateur ou mot de passe", success: null }));
    } else {
        req.session.username = usr;
        req.session.username_id = response;
        req.session.connected = true;
        res.redirect('/home');
        return;
    }
})

router.get('/', (req, res, next) => {
    return res.render('login', { error: null, success: null });
});


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const config = require("../data/config").config;
var https = require('https');


passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK
    },
    (token, refreshToken, profile, done) => {
        return done(null, {
            profile: profile,
            token: token,
            refreshToken: refreshToken
        });
    })
);

router.use(passport.initialize());

router.get('/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/yt-analytics.readonly', 'https://www.googleapis.com/auth/youtube.readonly'],
    accessType: 'offline', approvalPrompt: 'force'
}));

var getGoogleData = (token) => {
    return new Promise((resolve, reject) => {
        https.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token, (resp) => {
            resp.on('data', (d) => {
                resolve(JSON.parse(d));
            });
        })
    })
}

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
    getGoogleData(req.user.token)
    .then(async (d) => {
        // console.log(d);
        // console.log(req.user.token)
        await google_login(d.id, req.user.token);
        req.session.username = d.name;
        req.session.username_id = d.id;
        req.session.connected = true;
        res.redirect('/home');
    })
});


module.exports = router;