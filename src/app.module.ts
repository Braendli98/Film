<<<<<<< HEAD
=======

>>>>>>> bb5dbeaa88d863971cd1a55ad12c5ab214b33192
import {
    type MiddlewareConsumer,
    Module,
    type NestModule,
} from '@nestjs/common';
import { AdminModule } from './admin/admin.module.js';
import { type ApolloDriverConfig } from '@nestjs/apollo';
<<<<<<< HEAD
import { DevModule } from './config/dev/dev.module.js';
import { FilmGetController } from './film/rest/film-get.controller.js';
import { FilmModule } from './film/film.module.js';
import { FilmWriteController } from './film/rest/film-write.controller.js';
=======
import { BuchGetController } from './film/rest/film-get.controller.js';
import { BuchModule } from './film/film.module.js';
import { BuchWriteController } from './film/rest/film-write.controller.js';
import { DevModule } from './config/dev/dev.module.js';
>>>>>>> bb5dbeaa88d863971cd1a55ad12c5ab214b33192
import { GraphQLModule } from '@nestjs/graphql';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { graphQlModuleOptions } from './config/graphql.js';
import { typeOrmModuleOptions } from './config/typeormOptions.js';

@Module({
    imports: [
        AdminModule,
<<<<<<< HEAD
        FilmModule,
=======
        BuchModule,
>>>>>>> bb5dbeaa88d863971cd1a55ad12c5ab214b33192
        DevModule,
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
        LoggerModule,
        KeycloakModule,
        TypeOrmModule.forRoot(typeOrmModuleOptions),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestLoggerMiddleware)
            .forRoutes(
                FilmGetController,
                FilmWriteController,
                'auth',
                'graphql',
            );
    }
}
