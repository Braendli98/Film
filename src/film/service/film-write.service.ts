/**
 * Das Modul besteht aus der Klasse {@linkcode FilmWriteService} für die
 * Schreiboperationen im Anwendungskern.
 * @packageDocumentation
 */

import { type DeleteResult, Repository } from 'typeorm';
import {
    IdExistsException,
    VersionInvalidException,
    VersionOutdatedException,
} from './exceptions.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Film } from '../entity/film.entity.js';
import { FilmReadService } from './film-read.service.js';
import { Filmplakat } from '../entity/filmplakat.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../../mail/mail.service.js';
import { Titel } from '../entity/titel.entity.js';
import { getLogger } from '../../logger/logger.js';

/** Typdefinitionen zum Aktualisieren eines Films mit `update`. */
export interface UpdateParams {
    /** ID des zu aktualisierenden Films. */
    readonly id: number | undefined;
    /** Film-Objekt mit den aktualisierten Werten. */
    readonly film: Film;
    /** Versionsnummer für die aktualisierenden Werte. */
    readonly version: string;
}

/**
 * Die Klasse `FilmWriteService` implementiert den Anwendungskern für das
 * Schreiben von Bücher und greift mit _TypeORM_ auf die DB zu.
 */
@Injectable()
export class FilmWriteService {
    private static readonly VERSION_PATTERN = /^"\d{1,3}"/u;

    readonly #repo: Repository<Film>;

    readonly #readService: FilmReadService;

    readonly #mailService: MailService;

    readonly #logger = getLogger(FilmWriteService.name);

    constructor(
        @InjectRepository(Film) repo: Repository<Film>,
        readService: FilmReadService,
        mailService: MailService,
    ) {
        this.#repo = repo;
        this.#readService = readService;
        this.#mailService = mailService;
    }

    /**
     * Ein neues Film soll angelegt werden.
     * @param Film Das neu abzulegende Film
     * @returns Die ID des neu angelegten Films
     * @throws IdExists falls die ISBN-Nummer bereits existiert
     */
    async create(film: Film): Promise<number> {
        this.#logger.debug('create: film=%o', film);
        await this.#validateCreate(film);

        const filmDb = await this.#repo.save(film); // implizite Transaktion
        this.#logger.debug('create: filmDb=%o', filmDb);

        await this.#sendmail(filmDb);

        return filmDb.id!;
    }

    /**
     * Ein vorhandenes Film soll aktualisiert werden. "Destructured" Argument
     * mit id (ID des zu aktualisierenden Films), film (zu aktualisierendes Film)
     * und version (Versionsnummer für optimistische Synchronisation).
     * @returns Die neue Versionsnummer gemäß optimistischer Synchronisation
     * @throws NotFoundException falls kein Film zur ID vorhanden ist
     * @throws VersionInvalidException falls die Versionsnummer ungültig ist
     * @throws VersionOutdatedException falls die Versionsnummer veraltet ist
     */
    // https://2ality.com/2015/01/es6-destructuring.html#simulating-named-parameters-in-javascript
    async update({ id, film, version }: UpdateParams): Promise<number> {
        this.#logger.debug(
            'update: id=%d, film=%o, version=%s',
            id,
            film,
            version,
        );
        if (id === undefined) {
            this.#logger.debug('update: Keine gueltige ID');
            throw new NotFoundException(`Es gibt kein Film mit der ID ${id}.`);
        }

        const validateResult = await this.#validateUpdate(film, id, version);
        this.#logger.debug('update: validateResult=%o', validateResult);
        if (!(validateResult instanceof Film)) {
            return validateResult;
        }

        const filmNeu = validateResult;
        const merged = this.#repo.merge(filmNeu, film);
        this.#logger.debug('update: merged=%o', merged);
        const updated = await this.#repo.save(merged); // implizite Transaktion
        this.#logger.debug('update: updated=%o', updated);

        return updated.version!;
    }

    /**
     * Ein Film wird asynchron anhand seiner ID gelöscht.
     *
     * @param id ID des zu löschenden Filmes
     * @returns true, falls das Film vorhanden war und gelöscht wurde. Sonst false.
     */
    async delete(id: number) {
        this.#logger.debug('delete: id=%d', id);
        const film = await this.#readService.findById({
            id,
            mitFilmplakate: true,
        });

        let deleteResult: DeleteResult | undefined;
        await this.#repo.manager.transaction(async (transactionalMgr) => {
            // Das Film zur gegebenen ID mit Titel und Abb. asynchron loeschen

            // TODO "cascade" funktioniert nicht beim Loeschen
            const titelId = film.titel?.id;
            if (titelId !== undefined) {
                await transactionalMgr.delete(Titel, titelId);
            }
            const filmplakate = film.filmplakate ?? [];
            for (const filmplakat of filmplakate) {
                await transactionalMgr.delete(Filmplakat, filmplakat.id);
            }

            deleteResult = await transactionalMgr.delete(Film, id);
            this.#logger.debug('delete: deleteResult=%o', deleteResult);
        });

        return (
            deleteResult?.affected !== undefined &&
            deleteResult.affected !== null &&
            deleteResult.affected > 0
        );
    }

    async #validateCreate({ id }: Film): Promise<undefined> {
        this.#logger.debug('#validateCreate: id=%s', id);
        if (await this.#repo.existsBy({ id })) {
            throw new IdExistsException(id);
        }
    }

    async #sendmail(film: Film) {
        const subject = `Neues Film ${film.id}`;
        const titel = film.titel?.titel ?? 'N/A';
        const body = `Das Film mit dem Titel <strong>${titel}</strong> ist angelegt`;
        await this.#mailService.sendmail({ subject, body });
    }

    async #validateUpdate(
        film: Film,
        id: number,
        versionStr: string,
    ): Promise<Film> {
        this.#logger.debug(
            '#validateUpdate: film=%o, id=%s, versionStr=%s',
            film,
            id,
            versionStr,
        );
        if (!FilmWriteService.VERSION_PATTERN.test(versionStr)) {
            throw new VersionInvalidException(versionStr);
        }

        const version = Number.parseInt(versionStr.slice(1, -1), 10);
        this.#logger.debug(
            '#validateUpdate: film=%o, version=%d',
            film,
            version,
        );

        const filmDb = await this.#readService.findById({ id });

        // nullish coalescing
        const versionDb = filmDb.version!;
        if (version < versionDb) {
            this.#logger.debug('#validateUpdate: versionDb=%d', version);
            throw new VersionOutdatedException(version);
        }
        this.#logger.debug('#validateUpdate: filmDb=%o', filmDb);
        return filmDb;
    }
}
