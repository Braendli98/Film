import { Film } from './film.entity.js';
import { Filmplakat as Filmplaket } from './filmplakat.entity.js';
import { Titel } from './titel.entity.js';

// erforderlich in src/config/db.ts und src/film/film.module.ts
export const entities = [Filmplaket, Film, Titel];
