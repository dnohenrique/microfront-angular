import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GeoLocationService } from '../../support/geo.location.service';
import { AngularOpenlayersModule } from 'ngx-openlayers';


@NgModule({
    declarations: [
        MapComponent
    ],
    imports: [
        ModalModule.forRoot(),
        AngularOpenlayersModule,
        CommonModule
    ],
    exports: [
        MapComponent
    ],
    providers: [GeoLocationService]
})
export class MapModule {
}
