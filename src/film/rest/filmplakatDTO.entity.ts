/* eslint-disable @typescript-eslint/no-magic-numbers */
/**
 * Das Modul besteht aus der Entity-Klasse.
 * @packageDocumentation
 */

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

/**
 * Entity-Klasse für Abbildung ohne TypeORM.
 */
export class FilmplakatDTO {
    @MaxLength(32)
    @ApiProperty({ example: 'Die Beschriftung', type: String })
    readonly beschriftung!: string;

    @MaxLength(16)
    @ApiProperty({ example: 'image/png', type: String })
    readonly contentType!: string;
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
