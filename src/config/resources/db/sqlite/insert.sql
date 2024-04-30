-- Copyright (C) 2023 - present Juergen Zimmermann, Hochschule Karlsruhe
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PgenreICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.

-- "Konzeption und Realisierung eines aktiven Datenbanksystems"
-- "Verteilte Komponenten und Datenbankanbindung"
-- "Design Patterns"
-- "Freiburger Chorfilm"
-- "Maschinelle Lernverfahren zur Behandlung von Bonitätsrisiken im Mobilfunkgeschäft"
-- "Software Pioneers"

INSERT INTO film(id, version, bewertung, genre, preis, datum, erzeugt, aktualisiert) VALUES
    (1,0,4,'Horror',11.1,'2022-02-01','2022-02-01 00:00:00','2022-02-01 00:00:00');
INSERT INTO film(id, version, bewertung, genre, preis, datum, erzeugt, aktualisiert) VALUES
    (20,0,2,'Action',22.2,'2022-02-02','2022-02-02 00:00:00','2022-02-02 00:00:00');
INSERT INTO film(id, version, bewertung, genre, preis, datum, erzeugt, aktualisiert) VALUES
    (30,0,3,'Horror',33.3,'2022-02-03','2022-02-03 00:00:00','2022-02-03 00:00:00');
INSERT INTO film(id, version, bewertung, genre, preis, datum, erzeugt, aktualisiert) VALUES
    (40,0,4,'Horror',44.4,'2022-02-04','2022-02-04 00:00:00','2022-02-04 00:00:00');
INSERT INTO film(id, version, bewertung, genre, preis, datum, erzeugt, aktualisiert) VALUES
    (50,0,2,'Action',55.5,'2022-02-05','2022-02-05 00:00:00','2022-02-05 00:00:00');
INSERT INTO film(id, version, bewertung, genre, preis, datum, erzeugt, aktualisiert) VALUES
    (60,0,1,'Action',66.6,'2022-02-06','2022-02-06 00:00:00','2022-02-06 00:00:00');

INSERT INTO titel(id, titel, beschreibung, film_id) VALUES
    (1,'Alpha','alpha',1);
INSERT INTO titel(id, titel, beschreibung, film_id) VALUES
    (20,'Beta',null,20);
INSERT INTO titel(id, titel, beschreibung, film_id) VALUES
    (30,'Gamma','gamma',30);
INSERT INTO titel(id, titel, beschreibung, film_id) VALUES
    (40,'Delta','delta',40);
INSERT INTO titel(id, titel, beschreibung, film_id) VALUES
    (50,'Epsilon','epsilon',50);
INSERT INTO titel(id, titel, beschreibung, film_id) VALUES
    (60,'Phi','phi',60);

INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (1,'Abb. 1','img/png',1);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (20,'Abb. 1','img/png',20);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (21,'Abb. 2','img/png',20);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (30,'Abb. 1','img/png',30);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (31,'Abb. 2','img/png',30);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (40,'Abb. 1','img/png',40);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (50,'Abb. 1','img/png',50);
INSERT INTO filmplakat(id, beschriftung, content_type, film_id) VALUES
    (60,'Abb. 1','img/png',60);
