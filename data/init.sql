
--
-- User Table
--

CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    username text,
    password text,
    google_token text,
    google_id text,
    google_channel text,
    like_index int,
    dislike_index int,
    meteo_city text,
    meteo_country text,
    epitechintra_token text,
    exchange_base text,
    exchange_value text,
    cn_joke text,
    pokemon text
);

--
-- Session Table
--

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
