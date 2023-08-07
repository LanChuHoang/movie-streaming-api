import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongoErrorsInterceptor } from "./interceptors/mongo-errors.interceptor";
import { PaginationService } from "./services/pagination/pagination.service";

@Module({
  providers: [
    PaginationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MongoErrorsInterceptor,
    },
  ],
})
export class DatabaseModule {}
