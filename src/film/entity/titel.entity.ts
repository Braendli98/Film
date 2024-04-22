import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './film.entity.js';

@Entity()
export class Titel {
    // https://typeorm.io/entities#primary-columns
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    readonly titel!: string;

    @Column('varchar')
    readonly beschreibung: string | undefined;

    @OneToOne(() => Film, (film) => film.titel)
    @JoinColumn({ name: 'film_id' })
    film: Film | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            titel: this.titel,
            beschreibung: this.beschreibung,
        });
}
