import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Common } from '../../support/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'fc-availability-galery-images',
  templateUrl: './galery-images.component.html',
  styleUrls: ['./galery-images.component.scss']
})
export class GaleryImagesComponent implements OnInit {

  constructor(
    private common: Common,
    private changeDetection: ChangeDetectorRef,
    private modalService: BsModalService) { }

  @Input() hotelImages: any = [];
  @Input() modalRef: any;

  ngOnInit() {
    this.modalService.onHide.subscribe((reason: string) => {
      this.common.showBodyScroll();
    });
  }

  hideModal() {
    this.modalRef.hide();
  }

}
