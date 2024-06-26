-- https://sqlite.org/lang_createtable.html
-- https://sqlite.org/stricttables.html ab 3.37.0
-- https://sqlite.org/syntax/column-constraint.html
-- https://sqlite.org/autoinc.html
-- https://sqlite.org/stricttables.html: INT, INTEGER, REAL, TEXT
-- https://sqlite.org/lang_createindex.html
-- https://stackoverflow.com/questions/37619526/how-can-i-change-the-default-sqlite-timezone

CREATE TABLE IF NOT EXISTS film (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    version        INTEGER NOT NULL DEFAULT 0,
    bewertung      INTEGER NOT NULL CHECK (bewertung >= 0 AND bewertung <= 5),
    genre          TEXT,
    preis          REAL,
    datum          TEXT,
    erzeugt        TEXT NOT NULL,
    aktualisiert   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS titel (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    titel         TEXT NOT NULL,
    beschreibung  TEXT,
    film_id       INTEGER NOT NULL UNIQUE REFERENCES film
);


CREATE TABLE IF NOT EXISTS filmplakat (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    beschriftung    TEXT NOT NULL,
    content_type    TEXT NOT NULL,
    film_id         INTEGER NOT NULL REFERENCES film
);
CREATE INDEX IF NOT EXISTS filmplakat_film_id_idx ON filmplakat(film_id);
