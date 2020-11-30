const { Pool } = require('pg');

const config = {
    "HOST" : "0.0.0.0",
    "PORT" : process.env.PORT || 8080,
    "pool" : new Pool({connectionString: process.env.DATABASE_URL}),
    "GOOGLE_CLIENT_ID": "712123902422-ovc9l15t1duq260flk5ul9k5igmbd148.apps.googleusercontent.com",
    "GOOGLE_CLIENT_SECRET": "47sJy8HnQAWPe-pxyybtyMl1",
    "GOOGLE_CALLBACK": "http://localhost:8080/login/google/callback"
};

exports.config = config;