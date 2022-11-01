import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularOpenlayersModule } from 'ngx-openlayers';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SimulatorDetailService } from './services/simulator-detail.service';
import { AlertMessageModule } from '../shared/components/alert-message/alert-message.module';
import { SimulatorDetailComponent } from './simulator-detail.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';

import { GaleryImagesModule } from '../shared/components/galery-images/galery-images.module';
import { GalleryThumbModule  } from '../shared/components//gallery-thumb/gallery-thumb.module';

import { MapModule } from '../shared/components/map/map.module';
import { SimulatorFilterModule } from '../simulator-filter/simulator-filter.module';


@NgModule({
    declarations: [
        SimulatorDetailComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        AngularOpenlayersModule,
        SimulatorFilterModule,
        NgxMaskModule.forRoot(),
        AlertMessageModule,
        CarouselModule,
        ModalModule.forRoot(),
        GaleryImagesModule,
        GalleryThumbModule,
        MapModule
    ],
    exports: [
        SimulatorDetailComponent
    ],
    providers: [
        SimulatorDetailService,
        BsModalService
    ]
})
export class SimulatorDetailModule {
}
