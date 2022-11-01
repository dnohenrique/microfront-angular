import { NgModule } from '@angular/core';
import { GaleryImagesComponent } from './galery-images.component';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
    declarations: [
        GaleryImagesComponent
    ],
    imports: [
        ModalModule.forRoot(),
        CarouselModule,
        CommonModule
    ],
    exports: [
        GaleryImagesComponent
    ],
    providers: []
})
export class GaleryImagesModule {
}
