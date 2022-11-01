import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { DetailService } from './services/detail.service';
import { Common } from '../shared/support/common';
import { ActivatedRoute, Router } from '@angular/router';
import SearchModel from '../shared/models/search.model';
import { List } from 'linqts';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { String } from 'typescript-string-operations';
import { AvailabilityConfig } from '../availability-config.model';
import { PlanService } from '../shared/services/plan.service';
import AvailabilityModel from '../shared/models/search.availability.model';

@Component({
  selector: 'fc-availability-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  @Output() errorEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() availableDays: number;
  @Input() availablePoints: number;
  @Input() availablePointsFormat: number;
  @Input() namePlan: string;
  @Input() simulator = false;
  @ViewChild('sessionExpiredInfo', { static: true }) sessionExpiredInfo: any;
  @ViewChild('roomsOffInfo', { static: true }) roomsOffInfo: any;

  exibeRoom = false;
  visibilityModal: boolean;
  visibilityRoomFilter: boolean;
  slideIndex = 1;
  clientXIni = 0;
  isMousedown = false;
  loading = false;
  viewSearch = false;
  entitySearch: SearchModel = {
    availabilityFilter: new AvailabilityModel()
  };
  entity: any;
  entityResult: any = {
    images: []
  };
  msgError = false;
  totalReview = 0;
  viewDescription = false;
  modalRefImages: BsModalRef;
  modalRefMapa: BsModalRef;
  modalSessionExpiredInfo: BsModalRef;
  modalRoomOffInfo: BsModalRef;
  viewRating = false;
  @Input() planIdDefault: string;
  filterPlans = [];

  constructor(
    private detailService: DetailService,
    private actRouter: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private modalService: BsModalService,
    public common: Common,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig) {
    this.visibilityModal = false;
    this.visibilityRoomFilter = true;
  }

  ngOnInit() {
    this.common.toScrollTop();
    this.modalService.onHide.subscribe((reason: string) => {
      this.common.showBodyScroll();
    });

    if (this.simulator) {
      this.planService.getPlans().then(result => {
        this.filterPlans = result.plans;
        let planId = this.entitySearch.availabilityFilter.planId || this.planIdDefault;
        const planSelected = new List<any>(this.filterPlans).First(plan => plan.id === planId);
        this.availableDays = planSelected.diarias;
        this.namePlan = planSelected.name;
      });
    }
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

  ngOnDestroy() {
  }

  viewRoom() {
    this.common.toScrollTop('#room-div');
  }

  getDetail(param: SearchModel = null) {
    this.common.toScrollTop();
    this.entityResult = {
      anyMap: true,
      images: []
    };
    this.entitySearch = param || this.common.getUrlSearchParams(this.actRouter);
    const idError = this.entitySearch.availabilityFilter.showModalSessionExpired;
    if (idError && idError > 0) {
      const sessionExpired = 88;
      const reject = 77;
      if (idError === sessionExpired) {
        this.sessionExpiredShow();
      } else if (idError === reject) {
        this.roomsOffShow();
      }
      this.entitySearch.availabilityFilter.showModalSessionExpired = 0;
      const paramValue = this.common.setUrlSearchParams(this.entitySearch.availabilityFilter);
      const newConfig = String.Format('{0}/{1}/{2}', this.availabilityConfig.urlRedirectDetail,
        paramValue, this.entitySearch.availabilityFilter.hotelId);
      this.router.navigate([newConfig]);
    }

    if (this.entitySearch !== undefined && this.entitySearch.availabilityFilter.hotelId > 0) {
      this.entity = {
        brokerId: this.entitySearch.availabilityFilter.brokerId || 1,
        checkinDate: this.entitySearch.availabilityFilter.checkinDate,
        checkoutDate: this.entitySearch.availabilityFilter.checkoutDate,
        hotelId: this.entitySearch.availabilityFilter.hotelId,
        iata: this.entitySearch.availabilityFilter.iata,
        numberOfNights: this.entitySearch.availabilityFilter.numberOfNights,
        rooms: this.entitySearch.availabilityFilter.rooms,
        userId: sessionStorage.getItem('xdc')
      };

      this.msgError = false;
      this.loading = true;
      this.exibeRoom = false;

      this.detailService.getDetail(this.entity).then(data => {
        if (data.result
          && data.result.hotelDetails) {

          this.common.setPageTitle(data.result.hotelDetails.name);

          this.loading = false;
          const hotel = data.result.hotelDetails;
          const primaryImage = hotel.urlThumb !== '' ? hotel.urlThumb : this.common.hotelNotImage;
          const secondImage = hotel.photos.length > 1 ? hotel.photos[1].url : this.common.hotelNotImage;
          const thirdImage = hotel.photos.length > 2 ? hotel.photos[2].url : this.common.hotelNotImage;
          const amenities = new List<any>(hotel.amenities).Select(a => {
            return { name: a.name['pt-BR'] };
          }).ToArray();

          let latitude = null;
          let longitude = null;

          if (hotel.localization) {
            latitude = hotel.localization.latitude;
            longitude = hotel.localization.longitude;
          }

          let countryName = '';
          let cityName = '';

          const destinationInfo = hotel.destination.name['pt-BR'].split(',');

          if (destinationInfo && destinationInfo.length > 0) {
            countryName = destinationInfo.splice(destinationInfo.length - 1).join(',');
            cityName = destinationInfo.join(',');
          }

          this.entityResult = {
            hotelId: hotel.id,
            name: hotel.name,
            review: data.result.review,
            description: hotel.description['pt-BR'],
            address:
              hotel.address.replace(',', '') + ' - ' +
              (cityName ? cityName.trim() : '' + ' - ') +
              (countryName ? ' - ' + countryName.trim() : ''),
            listCategory: new Array(parseInt(hotel.category, 0)),
            primaryImage,
            secondImage,
            thirdImage,
            anyImages: hotel.photos.length > 2,
            anyMap: latitude && longitude,
            amenities,
            latitude,
            longitude,
            images: hotel.photos,
            checkInBegin: hotel.checkInBegin,
            checkOut: hotel.checkOut
          };

          this.common.toScrollTop('.detail');
          this.exibeRoom = true;

        } else {
          this.msgError = true;
        }
      }).catch(error => {
        this.errorEvent.emit({ redirect: error.status === 401 });
        this.msgError = true;
      });
    }
  }

  redirectReview() {
    this.common.toScrollTop('#btn-accordion-review');
    this.viewRating = true;
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
    this.entitySearch.availabilityFilter.showModalSessionExpired = 0;
    const param = this.common.setUrlSearchParams(this.entitySearch.availabilityFilter);
    this.router.navigate(['list/' + param]);
  }

  filterRoomsFocus(visible) {

    this.visibilityRoomFilter = visible;
  }

  errorEventRoom(error) {
    this.errorEvent.emit(error);
  }

  resultReviews(result) {
    this.totalReview = result;
  }

  // Abrir modal com informação de sessão expirada
  sessionExpiredShow() {
    this.modalSessionExpiredInfo = this.modalService.show(this.sessionExpiredInfo,
      { keyboard: false, backdrop: 'static', class: 'modal-md' });
    this.common.hideBodyScroll();
  }

  // Fechar modal com informação de sessão expirada
  sessionExpiredHide() {
    this.modalSessionExpiredInfo.hide();
    this.common.showBodyScroll();
  }

  // Abrir modal com informação de sessão expirada
  roomsOffShow() {
    this.modalRoomOffInfo = this.modalService.show(this.roomsOffInfo,
      { keyboard: false, backdrop: 'static', class: 'modal-room-off' });
    this.common.hideBodyScroll();
  }

  // Fechar modal com informação de sessão expirada
  roomsOffHide() {
    this.modalRoomOffInfo.hide();
    this.common.showBodyScroll();
  }
}
