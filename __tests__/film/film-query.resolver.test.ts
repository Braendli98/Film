// @eslint-community/eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type Film, type Genre } from '../../src/film/entity/film.entity.js';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';
import { type GraphQLFormattedError } from 'graphql';
import { type GraphQLRequest } from '@apollo/server';
import { HttpStatus } from '@nestjs/common';

// eslint-disable-next-line jest/no-export
export interface GraphQLResponseBody {
    data?: Record<string, any> | null;
    errors?: readonly [GraphQLFormattedError];
}

type FilmDTO = Omit<Film, 'filmplakate' | 'aktualisiert' | 'erzeugt'>;
// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const idVorhanden = '1';

const titelVorhanden = 'Alpha';
const teilTitelVorhanden = 'a';
const teilTitelNichtVorhanden = 'abc';

const bewertungVorhanden = 2;
const bewertungNichtVorhanden = 99;

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('GraphQL Queries', () => {
    let client: AxiosInstance;
    const graphqlPath = 'graphql';

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
            // auch Statuscode 400 als gueltigen Request akzeptieren, wenn z.B.
            // ein Enum mit einem falschen String getestest wird
            validateStatus: () => true,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Film zu vorhandener ID', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    film(id: "${idVorhanden}") {
                        version
                        bewertung
                        genre
                        preis
                        datum
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu); // eslint-disable-line sonarjs/no-duplicate-string
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { film } = data.data!;
        const result: FilmDTO = film;

        expect(result.titel?.titel).toMatch(/^\w/u);
        expect(result.version).toBeGreaterThan(-1);
        expect(result.id).toBeUndefined();
    });

    test('Film zu nicht-vorhandener ID', async () => {
        // given
        const id = '999999';
        const body: GraphQLRequest = {
            query: `
                {
                    film(id: "${id}") {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.film).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toBe(`Es gibt kein Film mit der ID ${id}.`);
        expect(path).toBeDefined();
        expect(path![0]).toBe('film');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test('Film zu vorhandenem Titel', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        titel: "${titelVorhanden}"
                    }) {
                        genre
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();

        expect(data.data).toBeDefined();

        const { filme } = data.data!;

        expect(filme).not.toHaveLength(0);

        const filmeArray: FilmDTO[] = filme;

        expect(filmeArray).toHaveLength(1);

        const [film] = filmeArray;

        expect(film!.titel?.titel).toBe(titelVorhanden);
    });

    test('Film zu vorhandenem Teil-Titel', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        titel: "${teilTitelVorhanden}"
                    }) {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { filme } = data.data!;

        expect(filme).not.toHaveLength(0);

        const filmeArray: FilmDTO[] = filme;
        filmeArray
            .map((film) => film.titel)
            .forEach((titel) =>
                expect(titel?.titel.toLowerCase()).toEqual(
                    expect.stringContaining(teilTitelVorhanden),
                ),
            );
    });

    test('Film zu nicht vorhandenem Titel', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        titel: "${teilTitelNichtVorhanden}"
                    }) {
                        genre
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.filme).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toMatch(/^Keine Filme gefunden:/u);
        expect(path).toBeDefined();
        expect(path![0]).toBe('filme');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test('Filme zu vorhandener "bewertung"', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        bewertung: ${bewertungVorhanden},
                        titel: "${teilTitelVorhanden}"
                    }) {
                        bewertung
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();

        expect(data.data).toBeDefined();

        const { filme } = data.data!;

        expect(filme).not.toHaveLength(0);

        const filmeArray: FilmDTO[] = filme;

        filmeArray.forEach((film) => {
            const { bewertung, titel } = film;

            expect(bewertung).toBe(bewertungVorhanden);
            expect(titel?.titel.toLowerCase()).toEqual(
                expect.stringContaining(teilTitelVorhanden),
            );
        });
    });

    test('Kein Film zur nicht-vorhandenen "bewertung"', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        bewertung: ${bewertungNichtVorhanden}
                    }) {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.filme).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toMatch(/^Keine Filme gefunden:/u);
        expect(path).toBeDefined();
        expect(path![0]).toBe('filme');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test('Filme zum Genre "Action"', async () => {
        // given
        const filmGenre: Genre = 'Action';
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        genre: ${filmGenre}
                    }) {
                        genre
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();

        expect(data.data).toBeDefined();

        const { filme } = data.data!;

        expect(filme).not.toHaveLength(0);

        const filmeArray: FilmDTO[] = filme;

        filmeArray.forEach((film) => {
            const { genre, titel } = film;

            expect(genre).toBe(filmGenre);
            expect(titel?.titel).toBeDefined();
        });
    });

    test('Filme zur einer ungueltigem Genre', async () => {
        // given
        const filmGenre = 'UNGUELTIG';
        const body: GraphQLRequest = {
            query: `
                {
                    filme(suchkriterien: {
                        genre: ${filmGenre}
                    }) {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.BAD_REQUEST);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data).toBeUndefined();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { extensions } = error;

        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('GRAPHQL_VALIDATION_FAILED');
    });

    // test('Filme mit lieferbar=true', async () => {
    //     // given
    //     const body: GraphQLRequest = {
    //         query: `
    //             {
    //                 filme(suchkriterien: {
    //                     lieferbar: true
    //                 }) {
    //                     lieferbar
    //                     titel {
    //                         titel
    //                     }
    //                 }
    //             }
    //         `,
    //     };

    //     // when
    //     const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
    //         await client.post(graphqlPath, body);

    //     // then
    //     expect(status).toBe(HttpStatus.OK);
    //     expect(headers['content-type']).toMatch(/json/iu);
    //     expect(data.errors).toBeUndefined();

    //     expect(data.data).toBeDefined();

    //     const { filme } = data.data!;

    //     expect(filme).not.toHaveLength(0);

    //     const filmeArray: FilmDTO[] = filme;

    //     filmeArray.forEach((film) => {
    //         const { lieferbar, titel } = film;

    //         expect(lieferbar).toBe(true);
    //         expect(titel?.titel).toBeDefined();
    //     });
    // });
});

/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable max-lines */
