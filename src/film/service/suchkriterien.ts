/**
 * Das Modul besteht aus der Klasse {@linkcode FilmReadService}.
 * @packageDocumentation
 */

import { type Genre } from './../entity/film.entity.js';

/**
 * Typdefinition für `FilmReadService.find()`und `QueryBuilder.build()`
 */
export interface Suchkriterien {
    readonly bewertung?: number;
    readonly genre?: Genre;
    readonly preis?: number;
    readonly datum?: string;
    readonly javascript?: string;
    readonly typescript?: string;
    readonly titel?: string;
}
