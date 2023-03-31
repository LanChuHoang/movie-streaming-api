import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class MongoErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err.name === "MongoServerError" && err.code === 11000) {
          return throwError(
            () => new ConflictException("Resource already exists"),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
