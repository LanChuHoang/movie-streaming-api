import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import authConfig from "./auth/config/auth.config";
import appConfig from "./configs/app.config";
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
    MongooseModule.forRoot(
      "mongodb+srv://admin:gGg1HSPucmrXsNZ6@cluster0.4smxb.mongodb.net/v2",
    ),
  ],
})
export class AppModule {}
