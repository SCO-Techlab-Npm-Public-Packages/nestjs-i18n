import { Controller, Get } from "@nestjs/common";
import { TranslateService } from "@app/nestjs-i18n";

@Controller('nestjs-i18n')
export class AppController {

  constructor(private readonly translateService: TranslateService) {}

  @Get()
  async dummy() {
    console.log(
      `[dummy] Label 'hello-world' in lang '${this.translateService.getCurrentLang()}' translate value is: ${this.translateService.translate('hello-world')}`
    );

    console.log(`[dummy] Nested translate block example 'tests / tests1 / 1': ${this.translateService.translate('tests.test1.1')}`);
    
    // Another example, you can pass the JSON object levels as a string array
    // console.log(`[dummy] Nested translate block example 'tests / tests1 / 1': ${this.translateService.translate(['tests', 'test1', '1'])}`);

    return this.translateService.translate('hello-world');
  }
}
