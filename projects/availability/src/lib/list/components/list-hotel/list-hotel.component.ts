import { Component, Input, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { String } from 'typescript-string-operations';
import { Common } from '../../../shared/support/common';
import HotelModel from '../../models/hotel.model';
import { Router } from '@angular/router';
import { AvailabilityConfig } from '../../../availability-config.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { List } from 'linqts';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import AvailabilityModel from '../../../shared/models/search.availability.model';

@Component({
  selector: 'fc-availability-list-hotel',
  templateUrl: './list-hotel.component.html',
  styleUrls: ['./list-hotel.component.scss']
})
export class ListHotelComponent {
  @Input() entity: AvailabilityModel;
  @Input() hotels: HotelModel[];
  @Input() token: string;
  @Input() loading: boolean;
  @Input() simulator = false;
  @Output() setReviewHotelsEvent: EventEmitter<object> = new EventEmitter();
  @ViewChild('loadingFirstStep', { static: true }) loadingFirstStep: any;

  viewHotels: any[] = [];
  time = 0;
  modalLoadingFirstStep: BsModalRef;
  constructor(
    public common: Common,
    public deviceService: DeviceDetectorService,
    private router: Router,
    private modalService: BsModalService,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
  ) {

  }

  clickOut(e, h) {
    const element = e.toElement || e.target;

    if (element.id.indexOf('contentRecommended') === -1 && element.id.indexOf('btnRecommend') === -1) {
      h.viewRecommend = false;
    }
  }

  getHotels(datas) {
    this.viewHotels = datas;
    this.loading = true;
    // this.loadingFirstStepShow();
    if (new List<any>(datas).Any(data => data.name)) {
      // this.loadingFirstStepHide();
      this.hideLoading();
    }
  }

  hideLoading() {

    const funTimeOut = setTimeout(() => {
      this.loading = false;
      this.time = 600;
      clearTimeout(funTimeOut);
    }, this.time);
  }

  goToDetail(hotel) {
    if (!this.loading) {
      this.entity.brokerId = hotel.broker;
      this.entity.token = this.token;
      this.entity.showModalSessionExpired = 0;
      const param = this.common.setUrlSearchParams(this.entity);
      const urlRedirect = this.simulator ? this.availabilityConfig.urlSimulatorDetail : this.availabilityConfig.urlRedirectDetail;
      const url = String.Format('{0}/{1}/{2}/1', urlRedirect, param, hotel.id);
      window.open('#/' + url, '_blank');
    }
  }

  // Abrir modal de loading
  /*   loadingFirstStepShow() {
      if (this.modalService.getModalsCount() === 0) {
        this.modalLoadingFirstStep = this.modalService.show(this.loadingFirstStep,
          { keyboard: false, backdrop: 'static', class: 'modal-md' });
        this.common.hideBodyScroll();
      }
      const funTimeOut = setTimeout(() => {
        this.loadingFirstStepHide();
        this.time = 6000;
        clearTimeout(funTimeOut);
      }, this.time);
    } */

  // Fechar modal de loading
  /*   loadingFirstStepHide() {
      this.modalLoadingFirstStep.hide();
      this.common.showBodyScroll();
    } */
}
