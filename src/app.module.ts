import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import authConfig from "./auth/config/auth.config";
import appConfig from "./configs/app.config";
import { MoviesModule } from "./movies/movies.module";
import { PeopleModule } from "./people/people.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { ShowsModule } from "./shows/shows.module";
import { UsersModule } from "./users/users.module";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("MYSQL_HOST"),
        port: +configService.get("MYSQL_PORT"),
        username: configService.get("MYSQL_USERNAME"),
        password: configService.get("MYSQL_PASSWORD"),
        database: configService.get("MYSQL_DATABASE"),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MoviesModule,
    ShowsModule,
    PeopleModule,
    ReviewsModule,
  ],
})
export class AppModule {}
