import { afterAll, beforeAll, describe, test } from '@jest/globals';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';
import { type ErrorResponse } from './error-response.js';
import { type FilmDtoOhneRef } from '../../src/film/rest/filmDTO.entity.js';
import { HttpStatus } from '@nestjs/common';
import { loginRest } from '../login.js';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const geaenderterFilm: FilmDtoOhneRef = {
    bewertung: 5,
    genre: 'Horror',
    preis: 3333,
    datum: '2022-03-03',
};
const idVorhanden = '30';

const geaenderterFilmIdNichtVorhanden: FilmDtoOhneRef = {
    bewertung: 4,
    genre: 'Horror',
    preis: 44.4,
    datum: '2022-02-04',
};
const idNichtVorhanden = '999999';

const geaenderterFilmInvalid: Record<string, unknown> = {
    rating: -1,
    genre: 'UNSICHTBAR',
    preis: -1,
    datum: '12345-123-123',
    titel: '?!',
};

const veralterFilm: FilmDtoOhneRef = {
    bewertung: 1,
    genre: 'Action',
    preis: 44.4,
    datum: '2022-02-04',
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('PUT /rest/:id', () => {
    let client: AxiosInstance;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json', // eslint-disable-line @typescript-eslint/naming-convention
    };

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}`;
        client = axios.create({
            baseURL,
            headers,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Vorhandener Film aendern', async () => {
        // given
        const url = `/rest/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"0"';

        // when
        const { status, data }: AxiosResponse<string> = await client.put(
            url,
            geaenderterFilm,
            { headers },
        );

        // then
        expect(status).toBe(HttpStatus.NO_CONTENT);
        expect(data).toBe('');
    });

    test('Nicht-vorhandener Film aendern', async () => {
        // given
        const url = `/rest/${idNichtVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"0"';

        // when
        const { status }: AxiosResponse<string> = await client.put(
            url,
            geaenderterFilmIdNichtVorhanden,
            { headers },
        );

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);
    });

    test('Vorhandener Film aendern, aber mit ungueltigen Daten', async () => {
        // given
        const url = `/rest/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"0"';
        const expectedMsg = [
            expect.stringMatching(/^bewertung /u),
            expect.stringMatching(/^genre /u),
            expect.stringMatching(/^preis /u),
            expect.stringMatching(/^datum /u),
        ];

        // when
        const { status, data }: AxiosResponse<Record<string, any>> =
            await client.put(url, geaenderterFilmInvalid, { headers });

        // then
        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const messages: string[] = data.message;

        expect(messages).toBeDefined();
        expect(messages).toHaveLength(expectedMsg.length);
        expect(messages).toEqual(expect.arrayContaining(expectedMsg));
    });

    test('Vorhandener Film aendern, aber ohne Versionsnummer', async () => {
        // given
        const url = `/rest/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        delete headers['If-Match'];

        // when
        const { status, data }: AxiosResponse<string> = await client.put(
            url,
            geaenderterFilm,
            { headers },
        );

        // then
        expect(status).toBe(HttpStatus.PRECONDITION_REQUIRED);
        expect(data).toBe('Header "If-Match" fehlt');
    });

    test('Vorhandener Film aendern, aber mit alter Versionsnummer', async () => {
        // given
        const url = `/rest/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"-1"';

        // when
        const { status, data }: AxiosResponse<ErrorResponse> = await client.put(
            url,
            veralterFilm,
            { headers },
        );

        // then
        expect(status).toBe(HttpStatus.PRECONDITION_FAILED);

        const { message, statusCode } = data;

        expect(message).toMatch(/Versionsnummer/u);
        expect(statusCode).toBe(HttpStatus.PRECONDITION_FAILED);
    });

    test('Vorhandener Film aendern, aber ohne Token', async () => {
        // given
        const url = `/rest/${idVorhanden}`;
        delete headers.Authorization;
        headers['If-Match'] = '"0"';

        // when
        const response: AxiosResponse<Record<string, any>> = await client.put(
            url,
            geaenderterFilm,
            { headers },
        );

        // then
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test('Vorhandener Film aendern, aber mit falschem Token', async () => {
        // given
        const url = `/rest/${idVorhanden}`;
        const token = 'FALSCH';
        headers.Authorization = `Bearer ${token}`;

        // when
        const response: AxiosResponse<Record<string, any>> = await client.put(
            url,
            geaenderterFilm,
            { headers },
        );

        // then
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});
