import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { SimulatorDetailService } from './services/simulator-detail.service';
import { Common } from '../shared/support/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AvailabilityConfig } from '../availability-config.model';
import HotelSimulatorModel from '../simulator-list/models/hotel-simulator.model';
import { List } from 'linqts';

declare var $: any;

@Component({
  selector: 'fc-availability-simulator-detail',
  templateUrl: './simulator-detail.component.html',
  styleUrls: ['./simulator-detail.component.scss']
})
export class SimulatorDetailComponent implements OnInit {

  visibilityModal: boolean;
  slideIndex = 1;
  clientXIni = 0;
  isMousedown = false;

  constructor(
    private simulatorDetailService: SimulatorDetailService,
    private actRouter: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    public common: Common,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
  ) {
    this.visibilityModal = false;
  }

  loading = false;
  viewSearch = false;
  entityResult: any = {
    images: [],
    hotelDetails: {
      listCategory: []
    }
  };
  msgError = false;
  viewDescription = true;
  modalRefImages: BsModalRef;
  modalRefMapa: BsModalRef;
  entitySearch: HotelSimulatorModel;

  ngOnInit() {
    this.common.toScrollTop();
    this.modalService.onHide.subscribe((reason: string) => {
      this.common.showBodyScroll();
    });

    this.getDetail();
  }


  onChangeVisibilityModal(evento) {
    this.visibilityModal = evento.novoValor;
  }

  plusDivs(n) {
    if (this.slideIndex === 1 && n === -1) { return; }
    if (this.slideIndex === this.entityResult.images.length && n === 1) { return; }

    this.slideIndex += n;
  }

  goStartChangeGallery(clientX) {
    this.isMousedown = true;
    this.clientXIni = clientX;
  }

  @HostListener('touchmove', ['$event'])
  onTouchmove(event: TouchEvent) {
    const target = event.target as HTMLTextAreaElement;

    if (target.id.includes('selectedSlide')) {
      if (event.changedTouches[0].clientX > this.clientXIni) {
        this.plusDivs(1);
      }
      if (event.changedTouches[0].clientX < this.clientXIni) {
        this.plusDivs(-1);
      }
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchstart(event: TouchEvent) {
    this.goStartChangeGallery(event.changedTouches[0].clientX);
  }

  getDetail() {
    this.common.toScrollTop();
    this.entityResult = {
      hotelDetails: {
        listCategory: []
      }
    };

    this.msgError = false;
    const param = this.common.getUrlSearchSimulatorParams(this.actRouter);

    if (param != null && param.hotelSimulatorFilter.hotelId > 0) {
      this.entitySearch = param;
      this.simulatorDetailService.getDetail(param.hotelSimulatorFilter.hotelId).then(data => {

        if (data.result.hotels !== undefined
        ) {
          this.entityResult = data.result.hotels[0];
          this.entityResult.primaryImage = this.entityResult.imageUrl !== '' ? this.entityResult.imageUrl : this.common.hotelNotImage;

          this.entityResult.hotelDetails.listCategory = new Array(parseInt(this.entityResult.hotelDetails.category, 0));

          this.entityResult.secondImage = this.entityResult.hotelDetails.photos.length > 1 ?
            this.entityResult.hotelDetails.photos[1].url : this.common.hotelNotImage;

          this.entityResult.thirdImage = this.entityResult.hotelDetails.photos.length > 2 ?
            this.entityResult.hotelDetails.photos[2].url : this.common.hotelNotImage;

          this.entityResult.anyImages = this.entityResult.hotelDetails.photos.length > 1;

          this.entityResult.anyDescription = this.entityResult.hotelDetails.description !== '';

          this.entityResult.anyMap = this.entityResult.hotelDetails.localization.longitude !== 0
            && this.entityResult.hotelDetails.localization.latitude !== 0;

          this.entityResult.images = new List<any>(this.entityResult.hotelDetails.photos).Select(p => {
            return {
              imageUrl: p.url
            };
          }).ToArray();

        } else {
          this.msgError = true;
        }
      }).catch(exception => {
        this.msgError = true;
      });
    } else {
      this.msgError = true;
    }

  }


  accordionView() {
    this.viewDescription = !this.viewDescription;
  }

  modalViewImages(hotelModalImages) {
    this.modalRefImages = this.modalService.show(hotelModalImages, { class: 'fc-modal modal-lg' });
    this.common.hideBodyScroll();
  }

  modalViewMapa(hotelModalMapa) {
    this.modalRefMapa = this.modalService.show(hotelModalMapa, { class: 'fc-modal modal-lg' });
    this.common.hideBodyScroll();
  }

  bakcList() {
    const param = this.common.setUrlSearchSimulatorParams(this.entitySearch.hotelSimulatorFilter);
    this.router.navigate([this.availabilityConfig.urlSimulatorList + param]);
  }
}
