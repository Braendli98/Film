import { Film } from './film.entity.js';
import { Filmplakat } from './filmplakat.entity.js';
import { Titel } from './titel.entity.js';

// erforderlich in src/config/db.ts und src/film/film.module.ts
export const entities = [Filmplakat, Film, Titel];
