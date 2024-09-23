import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TranslateService } from '@app/nestjs-i18n/translate.service';
import { TRANSLATES_MOCK } from './translates.mock';

@Injectable()
export class AppInterceptor implements NestInterceptor {

  constructor(private readonly translateService: TranslateService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestLanguage: string = this.translateService.requestLanguage(request);

     // Translates json files example
    this.translateService.setCurrentLang(requestLanguage);

    // Translates loaded from external example
    /* const current = Object.values(TRANSLATES_MOCK)[Object.keys(TRANSLATES_MOCK).indexOf(requestLanguage)];
    this.translateService.setValues(current); */
    
    return next.handle().pipe(
      tap(() => {
        
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}