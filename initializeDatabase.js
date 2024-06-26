const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'src', 'admin', 'config', 'dev', 'resources', 'db', 'sqlite', 'film.sqlite');
const createSQL = path.join(__dirname, 'src', 'admin', 'config', 'dev', 'resources', 'db', 'sqlite', 'create.sql');
const insertSQL = path.join(__dirname, 'src', 'admin', 'config', 'dev', 'resources', 'db', 'sqlite', 'insert.sql');

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  // Schema aus create.sql Datei lesen und ausführen
  const schema = fs.readFileSync(createSQL, 'utf8');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Fehler beim Erstellen der Tabelle:', err);
    } else {
      console.log('Tabelle erstellt oder existiert bereits.');

      // Daten aus insert.sql Datei einfügen
      const sqlInsert = fs.readFileSync(insertSQL, 'utf8');
      db.exec(sqlInsert, (err) => {
        if (err) {
          console.error('Fehler beim Einfügen der Daten:', err);
        } else {
          console.log('Daten erfolgreich eingefügt.');
        }
      });
    }
  });
});

db.close();
