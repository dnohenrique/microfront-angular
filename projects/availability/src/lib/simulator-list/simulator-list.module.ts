import { NgModule } from '@angular/core';
import { SimulatorListComponent } from './simulator-list.component';
import { SimulatorListService } from './services/simulator-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SimulatorFilterModule } from '../simulator-filter/simulator-filter.module';
import { SimulatorListHotelComponent } from './components/simulator-list-hotel/simulator-list-hotel.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { AlertMessageModule } from '../shared/components/alert-message/alert-message.module';
import { Common } from '../shared/support/common';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        NgxSelectModule,
        DeviceDetectorModule.forRoot(),
        SimulatorFilterModule,
        AlertMessageModule
    ],
    exports: [SimulatorListComponent],
    declarations: [
        SimulatorListComponent,
        SimulatorListHotelComponent
    ],
    providers: [
        SimulatorListService,
        Common
    ],
})
export class SimulatorListModule { }
