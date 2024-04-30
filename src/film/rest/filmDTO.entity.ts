/* eslint-disable max-classes-per-file */
/**
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import {
    IsArray,
    IsISO8601,
    IsInt,
    IsOptional,
    IsPositive,
    Matches,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FilmplakatDTO } from './filmplakatDTO.entity.js';
import { type Genre } from '../entity/film.entity.js';
import { TitelDTO } from './titelDTO.entity.js';
import { Type } from 'class-transformer';

export const MAX_RATING = 5;

/**
 * Entity-Klasse für Bücher ohne TypeORM und ohne Referenzen.
 */
export class FilmDtoOhneRef {
    @IsInt()
    @Min(0)
    @Max(MAX_RATING)
    @ApiProperty({ example: 5, type: Number })
    readonly bewertung: number | undefined;

    // hier was verändert
    @Matches(/^ACTION$|^HORROR$/u)
    @IsOptional()
    @ApiProperty({ example: 'ACTION', type: String })
    readonly genre: Genre | undefined;

    @IsPositive()
    @ApiProperty({ example: 1, type: Number })
    // statt number ggf. Decimal aus decimal.js analog zu BigDecimal von Java
    readonly preis!: number;

    @IsISO8601({ strict: true })
    @IsOptional()
    @ApiProperty({ example: '2021-01-31' })
    readonly datum: Date | string | undefined;
}

/**
 * Entity-Klasse für Bücher ohne TypeORM.
 */
export class FilmDTO extends FilmDtoOhneRef {
    @ValidateNested()
    @Type(() => TitelDTO)
    @ApiProperty({ type: TitelDTO })
    readonly titel!: TitelDTO; // NOSONAR

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilmplakatDTO)
    @ApiProperty({ type: [FilmplakatDTO] })
    readonly filmplakate: FilmplakatDTO[] | undefined;

    // PlakatDTO
}
/* eslint-enable max-classes-per-file */
