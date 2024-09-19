import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TranslateService } from '@app/nestjs-i18n/translate.service';

@Injectable()
export class AppInterceptor implements NestInterceptor {

  constructor(private readonly translateService: TranslateService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.translateService.setCurrentLang(this.translateService.requestLanguage(request));
    
    return next.handle().pipe(
      tap(() => {
        
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}