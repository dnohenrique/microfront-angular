import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { AvailabilityComponent } from './availability.component';
import { AvailabilityConfig } from './availability-config.model';
import { AvailabilityConfigService } from './availability-config.services';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AvailabilityComponent
  ],
  imports: [
    NgxPageScrollCoreModule.forRoot({duration: 500})
  ],
  providers: [ ],
  exports: [
    AvailabilityComponent
  ]
})
export class AvailabilityModule {

  static forRoot(availabilityConfig: AvailabilityConfig): ModuleWithProviders {
    return {
      ngModule: AvailabilityModule,
      providers: [AvailabilityConfigService, { provide: 'availabilityConfig', useValue: availabilityConfig }]
    };
  }
}
