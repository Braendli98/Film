
-- docker compose exec db sqlplus SYS/p@FREEPDB1 as SYSDBA '@/sql/create-user-film.sql'
-- docker compose exec db sqlplus film/p@FREEPDB1 '@/sql/create-schema-film.sql'
-- docker compose exec db sqlplus film/p@FREEPDB1 '@/sql/create.sql'

-- https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/CREATE-DIRECTORY.html
CREATE DIRECTORY IF NOT EXISTS csv_dir AS '/csv';

-- https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/CREATE-USER.html
-- https://blogs.oracle.com/sql/post/how-to-create-users-grant-them-privileges-and-remove-them-in-oracle-database
CREATE USER IF NOT EXISTS film IDENTIFIED BY p;

-- https://docs.oracle.com/en/database/oracle/oracle-database/23/sqlrf/GRANT.html
GRANT
  CONNECT,
  CREATE SESSION,
  CREATE TABLE,
  CREATE SEQUENCE,
  DROP ANY TABLE,
  READ ANY TABLE,
  INSERT ANY TABLE,
  UPDATE ANY TABLE,
  DELETE ANY TABLE,
  CREATE ANY INDEX,
  DROP ANY INDEX
TO film;
GRANT READ, WRITE ON DIRECTORY csv_dir TO film;
GRANT UNLIMITED TABLESPACE TO film;

-- Remote-Login zulassen
EXEC DBMS_XDB.SETLISTENERLOCALACCESS(FALSE);

-- https://docs.oracle.com/en/database/oracle/oracle-database/21/sqlrf/CREATE-TABLESPACE.html
-- https://www.carajandb.com/blog/2018/oracle-18-xe-und-multitenant
-- hier: initiale Groesse 10 MB mit 500 KB Extensions
-- dbf = data(base) file, default: im Verzeichnis /opt/oracle/product/18c/dbhomeXE/dbs
-- ALTER SYSTEM SET DB_CREATE_FILE_DEST = '/opt/oracle/tablespace';
-- DROP TABLESPACE filmspace INCLUDING CONTENTS AND DATAFILES;
-- CREATE TABLESPACE filmspace DATAFILE 'film.dbf' SIZE 10M;

exit
