import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { TranslateConfig } from "./translate.config";
import { TranslateService } from "./translate.service";

interface TranslateConfigFactory {
  createTranslateConfig(): Promise<TranslateConfig> | TranslateConfig;
}

export interface TranslateAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<TranslateConfigFactory>;
  useClass?: Type<TranslateConfigFactory>;
  useFactory?: (...args: any[]) => Promise<TranslateConfig> | TranslateConfig;
}

@Module({})
export class TranslateModule {
  
  static register(options: TranslateConfig): DynamicModule {
    return {
      module: TranslateModule,
      providers: [
        { provide: 'CONFIG_OPTIONS', useValue: options },
        TranslateService,
      ],
      exports: [
        TranslateService,
      ],
      global: true,
    };
  }

  public static registerAsync(options: TranslateAsyncConfig): DynamicModule {
    return {
      module: TranslateModule,
      providers: [
        ...this.createConnectProviders(options),
        TranslateService, 
      ],
      exports: [
        TranslateService,
      ],
      global: true,
    };
  }

  private static createConnectProviders(options: TranslateAsyncConfig): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    return [
      {
        provide: 'CONFIG_OPTIONS',
        useFactory: async (optionsFactory: TranslateConfigFactory) =>
          await optionsFactory.createTranslateConfig(),
        inject: [options.useExisting || options.useClass],
      },
    ];
  }
}
