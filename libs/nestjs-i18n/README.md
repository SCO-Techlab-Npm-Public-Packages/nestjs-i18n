### @SCO-Techlab/nestjs-i18n
Nest.JS i18n is a easy translate service for backend messages, is based in json files saved in a folder path.


### Get Started
- Install dependency
<pre>
npm i @sco-techlab/nestjs-i18n
</pre>
- Import Translate module in your 'app.module.ts' file, register or registerAsync methods availables
<pre>
@Module({
  imports: [
    TranslateModule.register({
      default: 'en',
      path: './i18n',
      encoding: 'utf8',
      header: 'accept-language',
    }),
    TranslateModule.registerAsync({
      useFactory: () => {
        return {
          default: 'en',
          path: './i18n',
          encoding: 'utf8',
          header: 'accept-language',
        };
      },
    }),
  ],
})
export class AppModule {}
</pre>
- Module import is global mode, to use trasnalte service only need constructor dependency inyection
- Catch your 'accept-language' header request in your interceptor and set your current language
<pre>
@Injectable()
export class AppInterceptor implements NestInterceptor {

  constructor(private readonly translateService: TranslateService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable&lt;any&gt; {
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
</pre>
- Add your interceptor to your 'app.module.ts' file if you have created it
<pre>
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
  ],
})
export class AppModule {}
</pre>


## Nest.JS i18n config
<pre>
export class TranslateConfig {
  default: string; // default file name who whill load if no accept-language header provided or accept-language header value not exists
  path: string; // Path of the folder who contains the translate.json files
  encoding?: BufferEncoding; // Encoding of the translate.json file by default value is 'utf8'
  header?: string; // Header name to find the language to set to the service in the interceptor
}
</pre>


## Examples
- Live coding: https://stackblitz.com/edit/sco-techlab-nestjs-i18n?file=src%2Fapp.interceptor.ts