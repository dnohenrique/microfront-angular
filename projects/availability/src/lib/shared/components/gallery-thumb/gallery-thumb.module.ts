import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { GalleryThumbComponent } from './gallery-thumb.component';

@NgModule({
  declarations: [GalleryThumbComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [
    GalleryThumbComponent
]
})
export class GalleryThumbModule { }
