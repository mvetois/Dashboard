// Imports of module
var express = require("express");
var session = require('express-session');
var PostgreSqlStore = require('connect-pg-simple')(session);

// Import of the config
var config = require("./data/config").config;

// Import of js file, when a path is called, they redirect it to one of them
const register = require('./routes/register.js');
const login = require('./routes/login.js');
const home = require('./routes/home.js');
const disconnect = require('./routes/disconnect.js');


// Express app configuration
var app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use( express.static( "public" ) );
app.use(session({
    store: new PostgreSqlStore({
        pool : config.pool,
        tableName: 'session'
    }),
    secret: 'secret',
    resave: true,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }, //30 days
    saveUninitialized: true,
    }
))

// When path is call, redirect it to the good js file
app.use('/register', register);
app.use('/login', login);
app.use('/home', home);
app.use('/disconnect', disconnect);

app.get('/', (req, res) => {
    if (req.session.connected) {
        res.writeHead(302, {"Location": "/home"});
        return res.end();
    }
    res.render('login', { error: null, success: null });
});



// http://0.0.0.0:8080/about.json -> display the json with server requirement
app.get('/about.json', (req, res) => {
    res.json({
        client: {
            host: req.connection.remoteAddress
        },
        server: {
            current_time: (new Date).getTime(),
            services: [{
                name: "Weather",
                widgets: [{
                    name: "local_weather",
                    description: "Display the complete weather description for a city",
                    params: [{
                        name: "city",
                        type: "string"
                    }, {
                        name: "country",
                        type: "string"
                    }]
                }]
            }, {
                name: "Epitech Intranet",
                widgets: [{
                    name: "user_informations",
                    description: "Display some information about the user",
                    params: [{
                        name: "token",
                        type: "string"
                    }]
                }]
            }, {
                name: "Currency",
                widgets: [{
                    name: "Currency converter",
                    description: "Convert some currency from euro to others",
                    params: [{
                        name: "amount",
                        type: "integer"
                    }]
                }, {
                    name: "History of currency value",
                    params: [{
                        name: "CurrencyFrom",
                        type: "string"
                    }, {
                        name: "CurrencyTo",
                        type: "string"
                    }]
                }]
            }, {
                name: "Youtube",
                widgets: [{
                    name: "Last liked video",
                    description: "Display informations about your last liked video",
                    params: [{
                        name: "token",
                        type: "string"
                    }]
                }, {
                    name: "Last disliked video",
                    description: "Display informations about your last disliked video",
                    params: [{
                        name: "token",
                        type: "string"
                    }]
                }, {
                    name: "Channel information",
                    description: "Display informations about a channel",
                    params: [{
                        name: "token",
                        type: "string"
                    },
                    {
                        name: "channel url",
                        type: "string"
                    }]
                }]
            }, {
                name: "ChuckNoris jokes",
                widgets: [{
                    name: "chuckNorisJokes",
                    description: "Display some one or more jokes about chuck noris",
                    params: [{
                        name: "key_word",
                        type: "string"
                    }]
                }]
            }, {
                name: "Pokemon",
                widgets: [{
                    name: "Pokemon Info",
                    description: "Display some information the selected pokemon",
                    params: [{
                        name: "pokemon_id",
                        type: "string"
                    }]
                }]
            }]
        }
    })
});

// http://0.0.0.0:8080/test -> see session status
app.get('/test', function(req, res, next) {
    res.send(req.session);
    // console.log(req.session)
});

// Say to the app to run with host and port cofigurated in the config
app.listen(config.PORT, config.HOST);

// Display a message with configurations
console.log("Running on http://" + config.HOST + ":" + config.PORT);