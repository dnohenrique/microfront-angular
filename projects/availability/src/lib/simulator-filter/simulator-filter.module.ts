import { NgModule } from '@angular/core';
import { SimulatorFilterComponent } from './simulator-filter.component';
import { SimulatorFilterService } from './services/simulator-filter.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxSelectModule } from 'ngx-select-ex';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { Common } from '../shared/support/common';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        NgxSelectModule,
        DeviceDetectorModule.forRoot()
    ],
    exports: [SimulatorFilterComponent],
    declarations: [SimulatorFilterComponent],
    providers: [
        Common,
        SimulatorFilterService
    ]
})
export class SimulatorFilterModule { }
