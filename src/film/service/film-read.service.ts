/**
 * Das Modul besteht aus der Klasse {@linkcode FilmReadService}.
 * @packageDocumentation
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Film } from '../entity/film.entity.js';
import { QueryBuilder } from './query-builder.js';
import { type Suchkriterien } from './suchkriterien.js';
import { getLogger } from '../../logger/logger.js';

/**
 * Typdefinition für `findById`
 */
export interface FindByIdParams {
    /** ID des gesuchten Films */
    readonly id: number;
    /** Sollen die Filmplakate mitgeladen werden? */
    readonly mitFilmplakate?: boolean;
}

/**
 * Die Klasse `FilmReadService` implementiert das Lesen für Filme und greift
 * mit _TypeORM_ auf eine relationale DB zu.
 */
@Injectable()
export class FilmReadService {
    static readonly ID_PATTERN = /^[1-9]\d{0,10}$/u;

    readonly #filmProps: string[];

    readonly #queryBuilder: QueryBuilder;

    readonly #logger = getLogger(FilmReadService.name);

    constructor(queryBuilder: QueryBuilder) {
        const filmDummy = new Film();
        this.#filmProps = Object.getOwnPropertyNames(filmDummy);
        this.#queryBuilder = queryBuilder;
    }

    // Rueckgabetyp Promise bei asynchronen Funktionen
    //    ab ES2015
    //    vergleiche Task<> bei C# und Mono<> aus Project Reactor
    // Status eines Promise:
    //    Pending: das Resultat ist noch nicht vorhanden, weil die asynchrone
    //             Operation noch nicht abgeschlossen ist
    //    Fulfilled: die asynchrone Operation ist abgeschlossen und
    //               das Promise-Objekt hat einen Wert
    //    Rejected: die asynchrone Operation ist fehlgeschlagen and das
    //              Promise-Objekt wird nicht den Status "fulfilled" erreichen.
    //              Im Promise-Objekt ist dann die Fehlerursache enthalten.

    /**
     * Ein Film asynchron anhand seiner ID suchen
     * @param id ID des gesuchten Films
     * @returns Der gefundene Film vom Typ [Film](film_entity_film_entity.Film.html)
     *          in einem Promise aus ES2015.
     * @throws NotFoundException falls kein Film mit der ID existiert
     */
    // https://2ality.com/2015/01/es6-destructuring.html#simulating-named-parameters-in-javascript
    async findById({ id, mitFilmplakate = false }: FindByIdParams) {
        this.#logger.debug('findById: id=%d', id);

        // https://typeorm.io/working-with-repository
        // Das Resultat ist undefined, falls kein Datensatz gefunden
        // Lesen: Keine Transaktion erforderlich
        const film = await this.#queryBuilder
            .buildId({ id, mitFilmplakate })
            .getOne();
        if (film === null) {
            throw new NotFoundException(`Es gibt kein Film mit der ID ${id}.`);
        }

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: film=%s, titel=%o',
                film.toString(),
                film.titel,
            );
            if (mitFilmplakate) {
                this.#logger.debug(
                    'findById: filmplakate=%o',
                    film.filmplakate,
                );
            }
        }
        return film;
    }

    /**
     * Filme asynchron suchen.
     * @param suchkriterien JSON-Objekt mit Suchkriterien
     * @returns Ein JSON-Array mit den gefundenen Filmen.
     * @throws NotFoundException falls keine Filme gefunden wurden.
     */
    async find(suchkriterien?: Suchkriterien) {
        this.#logger.debug('find: suchkriterien=%o', suchkriterien);

        // Keine Suchkriterien?
        if (suchkriterien === undefined) {
            return this.#queryBuilder.build({}).getMany();
        }
        const keys = Object.keys(suchkriterien);
        if (keys.length === 0) {
            return this.#queryBuilder.build(suchkriterien).getMany();
        }

        // Falsche Namen fuer Suchkriterien?
        if (!this.#checkKeys(keys)) {
            throw new NotFoundException('Ungueltige Suchkriterien');
        }

        // QueryBuilder https://typeorm.io/select-query-builder
        // Das Resultat ist eine leere Liste, falls nichts gefunden
        // Lesen: Keine Transaktion erforderlich
        const filme = await this.#queryBuilder.build(suchkriterien).getMany();
        if (filme.length === 0) {
            this.#logger.debug('find: Keine Filme gefunden');
            throw new NotFoundException(
                `Keine Filme gefunden: ${JSON.stringify(suchkriterien)}`,
            );
        }
        this.#logger.debug('find: filme=%o', filme);
        return filme;
    }

    #checkKeys(keys: string[]) {
        // Ist jedes Suchkriterium auch eine Property von Film?
        let validKeys = true;
        keys.forEach((key) => {
            if (
                !this.#filmProps.includes(key) &&
                key !== 'javascript' &&
                key !== 'typescript'
            ) {
                this.#logger.debug(
                    '#checkKeys: ungueltiges Suchkriterium "%s"',
                    key,
                );
                validKeys = false;
            }
        });

        return validKeys;
    }
}
