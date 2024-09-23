import { Inject, Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { TranslateConfig } from "./translate.config";

@Injectable()
export class TranslateService {


  private _currentLang: string = '';
  private _data: any = undefined;
  private _allTranslateFiles: string[] = [];

  constructor(@Inject('CONFIG_OPTIONS') private readonly options: TranslateConfig) {}

  private async onModuleInit(): Promise<void> {
    if (!this.options) {
      throw new Error('No translate options provided');
    }

    // If translate service is loaded from external there is not need to do checks
    if (this.options.externalData) {
      return;
    }

    if (!this.options.default) {
      throw new Error('No default language provided');
    }
    
    if (!this.options.path) {
      throw new Error('No translate files path provided');
    }

    if (!fs.existsSync(this.options.path)) {
      throw new Error(`Provided translate files path not exists '${this.options.path}'`);
    }

    this._allTranslateFiles = await new Promise<string[]>((resolve) => {
      fs.readdir(this.options.path, (error, archivos) => {
        if (error) resolve(undefined);
    
        const translateFiles: string[] = archivos.map(archivo => {
          return archivo.split('.')[0];
        });
        resolve(translateFiles);
      });
    });

    if (!this._allTranslateFiles || this._allTranslateFiles.length == 0) {
      throw new Error(`No translate files available on path '${this.options.path}'`);
    }

    if (!this._allTranslateFiles.find(t => t.toUpperCase() == this.options.default.toUpperCase())) {
      throw new Error(`Default translate file '${this.options.default}' not exist in path '${this.options.path}'`);
    }
  }

  private _setData(language: string = this.options.default): void {
    this._currentLang = '';
    this._data = undefined;

    new Promise((resolve) => {
      if (language != this.options.default && !this._allTranslateFiles.find(l => l == language)) {
        language = this.options.default;
      }
  
      try {
        this._data = JSON.parse(fs.readFileSync(`${this.options.path}/${language}.json`, this.options.encoding ? this.options.encoding : 'utf8'));
        if (this._data != undefined) {
          this._currentLang = language;
          resolve(true);
        } else {
          resolve(false);
        }
      } catch(error) {
        resolve(false);
      }
    });
  }

  public getCurrentLang(): string {
    return this._currentLang;
  }

  public setCurrentLang(lang: string): void {
    if (!lang || lang.length == 0) lang = this.options.default;
    this._currentLang = lang;
    this._setData(this._currentLang);
  }

  public setValues(translates: any): void {
    if (translates && Object.values(translates).length > 0) {
      this._data = translates;
    }
  }

  public translate(translate: string | string[]): string {
    if (!this._data) {
      return Array.isArray(translate) ? translate[translate.length - 1] : translate;
    }

    if (typeof translate === 'string') {
      return this._data[translate] ? this._data[translate] : translate;
    }

    let currentLevel = this._data;
    for (let i = 0; i < translate.length; i++) {
      const key = translate[i];
      if (currentLevel[key]) {
        currentLevel = currentLevel[key];
      } else {
        return translate[translate.length - 1];
      }
    }

    return typeof currentLevel === 'string' ? currentLevel : translate[translate.length - 1];
  }

  public requestLanguage(request: any): string {
    const header_name: string = this.options.header 
      ? this.options.header 
      : 'accept-language';

    const acceptLanguage = request.headers[header_name];
    if (!acceptLanguage || acceptLanguage.length == 0) {
      return this.options.default;
    }

    const languages = acceptLanguage ? acceptLanguage.split(',') : [];
    if (!languages || languages.length == 0) {
      return this.options.default;
    }

    const language = languages[0];
    if (!language || language.length == 0) {
      return this.options.default;
    }

    return language;
  }
}
