// Nest unterstützt verschiedene Werkzeuge fuer OR-Mapping
// https://docs.nestjs.com/techniques/database
//  * TypeORM     https://typeorm.io
//  * Sequelize   https://sequelize.org
//  * Knex        https://knexjs.org

// TypeORM unterstützt die Patterns
//  * "Data Mapper" und orientiert sich an Hibernate (Java), Doctrine (PHP) und Entity Framework (C#)
//  * "Active Record" und orientiert sich an Mongoose (JavaScript)

// TypeORM unterstützt u.a. die DB-Systeme
//  * Postgres
//  * MySQL
//  * SQLite durch sqlite3 und better-sqlite3
//  * Oracle
//  * Microsoft SQL Server
//  * SAP Hana
//  * Cloud Spanner von Google

/**
 * Das Modul besteht aus der Entity-Klasse.f
 * @packageDocumentation
 */

import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DecimalTransformer } from './decimal-transformer.js';
import { Filmplakat } from './filmplakat.entity.js';
import { Titel } from './titel.entity.js';
import { dbType } from '../../config/db.js';

/**
 * Alias-Typ für gültige Strings bei den Genre eines Film.
 */
export type Genre = 'ACTION' | 'HORROR';

/**
 * Entity-Klasse zu einem relationalen Tabelle
 */
// https://typeorm.io/entities
@Entity()
export class Film {
    // https://typeorm.io/entities#primary-columns
    // default: strategy = 'increment' (SEQUENCE, GENERATED ALWAYS AS IDENTITY, AUTO_INCREMENT)
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @VersionColumn()
    readonly version: number | undefined;

    // @Column() //TODO
    // @ApiProperty({ example: '0-0070-0644-6', type: String })
    // readonly isbn!: string;

    @Column('int')
    @ApiProperty({ example: 5, type: Number })
    readonly bewertung: number | undefined;

    @Column('varchar')
    @ApiProperty({ example: 'ACTION', type: String })
    readonly genre: Genre | undefined;

    @Column('decimal', {
        precision: 8,
        scale: 2,
        transformer: new DecimalTransformer(),
    })
    @ApiProperty({ example: 1, type: Number })
    // statt number ggf. Decimal aus decimal.js analog zu BigDecimal von Java
    readonly preis!: number;

    // @Column('decimal', {
    //     precision: 4,
    //     scale: 3,
    //     transformer: new DecimalTransformer(),
    // })
    // @ApiProperty({ example: 0.1, type: Number })
    // readonly rabatt: number | undefined;

    // @Column('decimal') // TypeORM unterstuetzt bei Oracle *NICHT* den Typ boolean
    // @ApiProperty({ example: true, type: Boolean })
    // readonly lieferbar: boolean | undefined;

    @Column('date')
    @ApiProperty({ example: '2021-01-31' })
    // TypeORM unterstuetzt *NICHT* das Temporal-API (ES2022)
    readonly datum: Date | string | undefined;

    // @Column('date')
    // @ApiProperty({ example: 'https://test.de/', type: String })
    // readonly homepage: string | undefined;

    // https://typeorm.io/entities#simple-array-column-type
    // nicht "readonly": null ersetzen durch []
    // @Column('simple-array')
    // schlagwoerter: string[] | null | undefined;

    // undefined wegen Updates
    @OneToOne(() => Titel, (titel) => titel.film, {
        cascade: ['insert', 'remove'],
    })
    readonly titel: Titel | undefined;

    // undefined wegen Updates
    @OneToMany(() => Filmplakat, (filmplakat) => filmplakat.film, {
        cascade: ['insert', 'remove'],
    })
    readonly filmplakate: Filmplakat[] | undefined;

    // https://typeorm.io/entities#special-columns
    // https://typeorm.io/entities#column-types-for-postgres
    // https://typeorm.io/entities#column-types-for-mysql--mariadb
    // https://typeorm.io/entities#column-types-for-oracle
    // https://typeorm.io/entities#column-types-for-sqlite--cordova--react-native--expo
    @CreateDateColumn({
        type: dbType === 'sqlite' ? 'datetime' : 'timestamp',
    })
    readonly erzeugt: Date | undefined;

    @UpdateDateColumn({
        type: dbType === 'sqlite' ? 'datetime' : 'timestamp',
    })
    readonly aktualisiert: Date | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            version: this.version,
            bewertung: this.bewertung,
            genre: this.genre,
            preis: this.preis,
            datum: this.datum,
            // schlagwoerter: this.schlagwoerter,
            erzeugt: this.erzeugt,
            aktualisiert: this.aktualisiert,
        });
}
