import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSearchComponent } from './filter-search.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgbModule, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { CustomDatepickerI18n, I18n } from './support/datePicker/CustomDatepickerI18n';
import { NgbDatePTParserFormatter } from './support/datePicker/NgbDatePTParserFormatter';
import { AutocompleteService } from './services/autocomplete.service';
import { NumberPickerModule } from 'ng-number-picker';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { HttpClientModule } from '@angular/common/http';
import { EncryptoDecryptoService } from '../shared/support/encrypto.decrypto.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { HttpClientService } from '../shared/services/http-client.service';
import { Common } from '../shared/support/common';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { PlanService } from '../shared/services/plan.service';
@NgModule({
    declarations: [
        FilterSearchComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        ClickOutsideModule,
        NgbModule,
        NgxSelectModule,
        NgxMaskModule.forRoot(),
        NumberPickerModule,
        DeviceDetectorModule.forRoot(),
        NgxPageScrollModule
    ],
    exports: [FilterSearchComponent],
    providers: [
        Common,
        HttpClientService,
        AutocompleteService,
        EncryptoDecryptoService,
        PlanService,
        [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
        [{ provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter }],
    ]
})
export class FilterSearchModule {
}
