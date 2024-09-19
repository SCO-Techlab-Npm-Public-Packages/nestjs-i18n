import { Controller, Get } from "@nestjs/common";
import { TranslateService } from "@app/nestjs-i18n";

@Controller('nestjs-i18n')
export class AppController {

  constructor(private readonly translateService: TranslateService) {}

  @Get()
  async dummy() {
    console.log(`[dummy] Label 'hello.world' in lang '${this.translateService.getCurrentLang()}' translate value is: ${this.translateService.translate('hello.world')}`);
    return this.translateService.translate('hello.world');
  }
}
