import { Component, OnInit, Input, TemplateRef, EventEmitter, Inject, Output, HostListener } from '@angular/core';
import { Common } from '../../../shared/support/common';
import { String } from 'typescript-string-operations';
import { DetailService } from '../../services/detail.service';
import { Router } from '@angular/router';
import { List } from 'linqts';
import { AvailabilityConfig } from '../../../availability-config.model';
import SearchRoomModel from '../../../shared/models/search.room.model';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import SearchModel from '../../../shared/models/search.model';
import AvailabilityModel from '../../../shared/models/search.availability.model';

declare var $: any;

@Component({
  selector: 'fc-availability-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  entityResult: any = {
    options: [{
      rooms: [{}],
      price: {},
      prices: [],
    }],
    viewRooms: []
  };

  @Input() isPageList = false;
  @Input() msgError: boolean;
  @Input() entitySearch: SearchModel = {
    availabilityFilter: new AvailabilityModel()
  };
  @Input() roomsDetail: any;
  @Input() simulator: any;
  @Input() filterPlans: any;
  @Input() availablePoints: number;
  @Input() availableDays: number;
  @Output() errorEventRoom: EventEmitter<object> = new EventEmitter();
  @Output() filterRoomsFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeRoomsFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeCheckinFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeCheckoutFocus: EventEmitter<any> = new EventEmitter<any>();

  entitySearchRoom: SearchModel = {
    availabilityFilter: new AvailabilityModel()
  };
  ages: any = [];
  visibilityRoomFilter: boolean;
  visibilityCalendarFilter: boolean;
  viewCalendar = false;
  focusCheckout = false;
  cityFocus = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  minDate: NgbDate;
  maxDate: NgbDate;
  todayNext: NgbDate;
  startDate: NgbDate;
  viewRoom = false;
  timeout: any = null;
  displayMonths = 1;
  readonlyCalendar = false;
  isMousedown = false;
  loading: boolean;
  roomSelected = {
    photos: []
  };
  msgEmpty = false;
  visibilityRoomModal: boolean;
  messaError = {
    destination: false,
    checkin: false,
    checkout: false
  };
  loadingPayment = false;
  time = 0;
  viewBroker: boolean;
  constructor(
    private detailService: DetailService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private common: Common,
    private calendar: NgbCalendar,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig) {
    this.visibilityRoomModal = false;
    this.visibilityRoomFilter = true;
    this.visibilityCalendarFilter = true;
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() + 1);
    this.todayNext = new NgbDate(dateToday.getFullYear(), dateToday.getMonth() + 1, dateToday.getDate());
    this.minDate = this.todayNext;
    this.startDate = calendar.getToday();
    this.toDate = null;

    if (this.common.verifyIsMobile()) {
      this.readonlyCalendar = true;
    }
  }

  ngOnInit() {
    this.getViewBorker();
    this.isMousedown = false;
    if (this.entitySearch !== undefined && this.entitySearch.availabilityFilter.hotelId > 0) {
      this.entitySearchRoom.availabilityFilter = Object.assign({}, this.entitySearch.availabilityFilter);
      this.getDetailRooms();
    }

    for (let index = 0; index <= 17; index++) {
      this.ages.push({ id: index, name: (index === 0 ? 'Até 1 ano' : index) });
    }
  }

  getDetailRooms(isNewSearch = false) {
    if (this.loading) {
      return true;
    }
    this.entityResult = {
      options: [{
        rooms: [{
          roomName: '',
          regime: ''
        }],
        price: {},
        prices: []
      }],
      viewRooms: []
    };

    this.msgError = false;
    this.msgEmpty = false;

    this.messaError = {
      destination: false,
      checkin: false,
      checkout: false
    };

    if (!this.entitySearchRoom.availabilityFilter.checkin ||
      !this.calendar.isValid(this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkin))) {
      this.messaError.checkin = true;
    }

    if (!this.entitySearchRoom.availabilityFilter.checkout
      || !this.calendar.isValid(this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkout))) {
      this.messaError.checkout = true;
    }

    if (!this.messaError.checkin && !this.messaError.checkout) {

      this.loading = true;

      this.fromDate = this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkin);
      this.startDate = this.fromDate;
      this.toDate = this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkout);

      let token = this.entitySearchRoom.availabilityFilter.token;
      let userId = this.entitySearchRoom.availabilityFilter.userId;
      if (isNewSearch) {
        token = '';

        if (this.simulator) {
          userId = '';
        } else {

        }
      }
      if (!this.simulator) {
        userId = sessionStorage.getItem('xdc');
      }


      const entity = {
        hotelId: this.entitySearchRoom.availabilityFilter.hotelId,
        checkin: this.common.ToDate(this.entitySearchRoom.availabilityFilter.checkin),
        checkout: this.common.ToDate(this.entitySearchRoom.availabilityFilter.checkout),
        destinationId: this.entitySearchRoom.availabilityFilter.iata.locale.city_id,
        rooms: this.entitySearchRoom.availabilityFilter.rooms,
        planId: this.entitySearchRoom.availabilityFilter.planId,
        cnpj: sessionStorage.getItem('acc'),
        token,
        userId
      };

      this.entitySearch.availabilityFilter = Object.assign({}, this.entitySearchRoom.availabilityFilter);
      this.entitySearchRoom.availabilityFilter.numberOfNights = this.common.calculateDate(entity.checkin, entity.checkout);
      this.detailService.getDetailRoom(entity).then(data => {
        if (data && data.options.length > 0) {
          this.entityResult = data;
          this.msgEmpty = false;
          this.entityResult.options.forEach(option => {
            option.price.planDailyUsedMax = option.price.planPointUsed > 0 || option.price.accumulatedPoint > 0
              || (option.price.planDailyUsed <= this.availableDays && option.price.planExtraPrice === 0)
              || option.price.planDailyUsed === this.availableDays ?
              option.price.planDailyUsed : option.price.planDailyUsed + 1;

          });
        } else {
          this.msgEmpty = true;
          this.loading = false;
        }
      }).catch(error => {
        this.loading = false;
        this.msgError = true;
        this.errorEventRoom.emit({ redirect: error.networkError.status === 401 });
      });
    }
  }

  getRooms(datas: any) {
    this.entityResult.viewRooms = datas;
    if (new List<any>(datas).Any((x) => x.numberRoom)) {
      this.loading = false;
    }
  }

  reloadPage() {
    location.reload();
  }

  openModalDetailRoom(room: any) {
    if (room.isPhoto || room.description) {
      room.amenities = room.amenities.filter(x => x.name);
      this.roomSelected = room;
      this.visibilityRoomModal = true;
    }
  }

  booking(option: any) {
    if (!this.loading) {
      const param = this.common.setUrlBookingParams(this.entitySearch.availabilityFilter, option, this.entityResult ) + '/1';
      if (this.availabilityConfig.isNewAba) {
        window.open(this.availabilityConfig.urlRedirectBooking + param, '_blank');
      } else {
        this.router.navigate([this.availabilityConfig.urlRedirectBooking + param]);
      }
    }
  }

  onChangeVisibilityModal(evento: any) {
    this.visibilityRoomModal = evento.novoValor;
  }

  goToRooms(element: any) {

    if (element === true
      || element.id === 'btn-filter-back'
      || element.id === 'btn-filter-close'
      || element.className.indexOf('custom-day') >= 0) {
      setTimeout(() => {
        this.common.toScrollTop('#room-div', 0);
      });
    }
  }

  //#region  Datepicker
  showCalendar(isCheckout: boolean = false) {

    const isMobile = this.common.verifyIsMobile();

    this.visibilityCalendarFilter = !isMobile;
    this.filterRoomsFocus.emit(this.visibilityCalendarFilter);

    if (isMobile) {
      this.common.toScrollTop();
    }

    this.viewCalendar = true;
    this.changeCheckoutFocus.emit(isCheckout);
    this.focusCheckout = isCheckout;
    const isValidCheckout = this.entitySearchRoom.availabilityFilter.checkout !== undefined &&
      this.entitySearchRoom.availabilityFilter.checkout !== '';

    if (this.focusCheckout && this.calendar.isValid(this.fromDate)) {
      const date = Object.assign({}, this.fromDate);
      const dateMax = new Date(date.year, date.month - 1, date.day);
      this.messaError.checkout = false;
      dateMax.setDate(dateMax.getDate() + 30);
      const strDateMax = String.Format('{0}{1}{2}',
        this.common.padLeft(dateMax.getDate(), 2),
        this.common.padLeft(dateMax.getMonth() + 1, 2), dateMax.getFullYear());

      this.maxDate = this.common.ToNgbDate(strDateMax);
      this.minDate = this.fromDate;

      if (isValidCheckout) {
        this.startDate = this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkout);
      }
    } else {
      this.messaError.checkin = false;
      if (isValidCheckout) {
        this.startDate = this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkin);
      } else {
        this.fromDate = null;
        this.entitySearchRoom.availabilityFilter.checkin = null;
      }

      setTimeout(() => {
        $('#checkinRoom').focus();
      });

      this.changeCheckinFocus.emit(true);
      this.minDate = this.todayNext;
      this.maxDate = null;
    }
  }

  clickOutCalendar(e: any) {

    const element = e.toElement || e.target;

    if (element.id !== 'checkinRoom'
      && element.id !== 'checkoutRoom'
      && element.id !== 'calendar-input-room'
      && element.id !== 'btnViewMap'
      && element.id !== 'selectedSlide'
      && element.id.indexOf('ApplyRoom') === -1
      && element.className !== 'next'
      && element.className !== 'prev') {
      this.viewCalendar = false;
      this.visibilityCalendarFilter = true;

      this.filterRoomsFocus.emit(true);
      this.changeCheckinFocus.emit(false);
      this.changeCheckoutFocus.emit(false);

      if (this.common.verifyIsMobile()) {
        this.goToRooms(element);
      }
    }
  }

  changedCheckin() {
    if (this.entitySearchRoom.availabilityFilter.checkin.length === 8) {
      const date = this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkin);

      if (this.calendar.isValid(date) && (date.after(this.minDate) || date.equals(this.minDate))) {
        this.focusCheckout = true;
        this.changeCheckoutFocus.emit(true);
        this.fromDate = null;
        this.entitySearchRoom.availabilityFilter.checkout = '';
        this.onDateSelection(date);
        setTimeout(() => {
          $('#checkoutRoom').focus();
        });
      } else {
        this.entitySearchRoom.availabilityFilter.checkin = '';
        this.fromDate = null;
        setTimeout(() => {
          $('#checkinRoom').val('');
        });
      }
    }
  }

  changedCheckout() {
    if (this.entitySearchRoom.availabilityFilter.checkout.length === 8) {

      const date = this.common.ToNgbDate(this.entitySearchRoom.availabilityFilter.checkout);

      const numberOfNights = this.common.calculateDate(this.common.ToDate(this.entitySearchRoom.availabilityFilter.checkin),
        this.common.ToDate(this.entitySearchRoom.availabilityFilter.checkout));

      if (this.calendar.isValid(date) && (date.after(this.fromDate) && numberOfNights <= 30)) {
        this.toDate = null;
        $('#checkoutRoom').blur();
        this.onDateSelection(date);
      } else {
        this.entitySearchRoom.availabilityFilter.checkout = '';
        this.toDate = null;
        setTimeout(() => {
          $('#checkoutRoom').val('');
        });
      }
    }
  }

  onDateSelection(date: NgbDate) {
    const day = this.common.padLeft(date.day, 2);
    const month = this.common.padLeft(date.month, 2);
    const dateFormat = String.Format('{0}/{1}/{2}', day, month, date.year);

    this.viewCalendar = true;

    if (this.focusCheckout) {
      this.toDate = null;
    }

    if (!this.fromDate && !this.toDate) {
      this.focusCheckout = true;
      setTimeout(() => {
        $('#checkoutRoom').focus();
      });

      this.fromDate = date;
      this.startDate = date;
      this.entitySearchRoom.availabilityFilter.checkin = dateFormat;

    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;

      this.entitySearchRoom.availabilityFilter.checkout = dateFormat;
      const dateFrom = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day);
      const dateTo = new Date(this.toDate.year, this.toDate.month, this.toDate.day);
      this.entitySearchRoom.availabilityFilter.numberOfNights = this.common.calculateDate(dateFrom, dateTo);
      this.viewCalendar = false;
    } else {
      this.focusCheckout = date.after(this.fromDate);
      this.fromDate = date;
      this.entitySearchRoom.availabilityFilter.checkout = '';

      this.toDate = null;
      this.entitySearchRoom.availabilityFilter.checkin = dateFormat;
      setTimeout(() => {
        $('#checkoutRoom').focus();
      });
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
  //#endregion

  //#region  Quartos
  applyRoom() {
    this.viewRoom = false;
    this.visibilityRoomFilter = true;

    this.changeRoomsFocus.emit(false);
    this.filterRoomsFocus.emit(true);

    if (this.common.verifyIsMobile()) {
      this.goToRooms(true);
    }

  }

  changeHospede() {
    this.entitySearchRoom.availabilityFilter.qtdRooms = this.entitySearchRoom.availabilityFilter.rooms.length;
    this.entitySearchRoom.availabilityFilter.qtdAdult = new List<SearchRoomModel>(this.entitySearchRoom.availabilityFilter.rooms)
      .Sum(r => r.quantityAdults);
    this.entitySearchRoom.availabilityFilter.qtdChild = new List<SearchRoomModel>(this.entitySearchRoom.availabilityFilter.rooms)
      .Sum(r => r.quantityChild);
    this.entitySearchRoom.availabilityFilter.qtdHospede = this.entitySearchRoom.availabilityFilter.qtdAdult +
      this.entitySearchRoom.availabilityFilter.qtdChild;
  }

  clickOut(e: any) {
    const element = e.toElement || e.target;

    if (element.id.indexOf('addQuartoFilterRoom') === -1
      && element.className.indexOf('fc-btn-danger') === -1
      && element.className.indexOf('del') === -1
      && element.className.indexOf('icon-lixeira') === -1
      && element.className.indexOf('btn-room') === -1
      && element.id !== 'checkinRoom'
      && element.id !== 'checkoutRoom'
      && element.id !== 'calendar-input-room'
      && element.id !== 'btnViewMap'
      && element.id !== 'selectedSlide'
      && element.className !== 'next'
      && element.className !== 'prev') {
      this.viewRoom = false;
      this.visibilityRoomFilter = true;

      this.changeRoomsFocus.emit(false);
      this.filterRoomsFocus.emit(true);

      if (this.common.verifyIsMobile()) {
        this.goToRooms(element);
      }
    }
  }

  viewRooms() {
    if (this.loading) {
      return true;
    }
    const isMobile = this.common.verifyIsMobile();

    this.viewRoom = true;
    this.visibilityRoomFilter = !isMobile;

    this.changeRoomsFocus.emit(true);
    this.filterRoomsFocus.emit(this.visibilityRoomFilter);

    // Quando o browser for Firefox desabilitar o click
    if (this.deviceService.browser === 'Firefox') {
      $('.number input').attr('disabled', 'disabled');
    }

    // Quando for versão mobile subir scrool ao topo
    if (isMobile) {
      this.common.toScrollTop();
    }
  }

  changeMaxQtd(room: any) {
    room.maxHospedeAdult = 5 - room.quantityChild;
    room.maxHospedeChild = 5 - room.quantityAdults;
  }

  changeAdult(room: any) {
    this.changeMaxQtd(room);
    this.changeHospede();
  }

  changeChild(room: any) {
    this.changeMaxQtd(room);
    if (room.quantityChild > room.childAgesCustom.length) {
      room.childAgesCustom.push({ id: (room.childAgesCustom.length + 1), age: 0 });
    } else {
      new List<any>(room.childAgesCustom).RemoveAt(room.childAgesCustom.length - 1);
    }
    this.changeHospede();
  }

  addRoom() {
    this.viewRoom = true;
    if (this.entitySearchRoom.availabilityFilter.rooms.length < 2) {
      this.entitySearchRoom.availabilityFilter.rooms.push({
        id: (this.entitySearchRoom.availabilityFilter.rooms.length + 1),
        quantityAdults: 1,
        quantityChild: 0,
        childAgesCustom: [],
        childAges: [],
        maxHospedeAdult: 8,
        maxHospedeChild: 7
      });
      this.changeHospede();
    }
  }

  removeRoom(room: any) {
    this.viewRoom = true;
    this.entitySearchRoom.availabilityFilter.rooms = new List<SearchRoomModel>(this.entitySearchRoom.availabilityFilter.rooms)
      .Where(r => r.id !== room.id).ToArray();
    this.changeHospede();
  }

  getViewBorker() {
    let view = false;
    const url = window.location.href;

    if (url.indexOf('webapp-colaborador-staging') !== -1 || url.indexOf('localhost:') !== -1) {
      view = true;
    }

    this.viewBroker = view;
  }

  getListRooms(optionRooms) {
    let room = null;
    let rooms = [];
    let quantityAdults = 0;
    let quantityChild = 0;

    if (optionRooms.length > 1) {
      rooms = optionRooms.filter(item =>
        item.roomName === optionRooms[0].roomName &&
        item.isNonRefundable === optionRooms[0].isNonRefundable &&
        this.common.toNumber(item.quantityAdults) === this.common.toNumber(optionRooms[0].quantityAdults) &&
        this.common.toNumber(item.quantityChild) === this.common.toNumber(optionRooms[0].quantityChild) &&
        item.brokerName === 'Ezlink');

      if (rooms.length === optionRooms.length) {
        optionRooms.forEach(a => {
          quantityAdults += this.common.toNumber(a.quantityAdults);
          quantityChild += this.common.toNumber(a.quantityChild);
        });

        room = Object.assign({}, rooms[0]);
        room.quantity = optionRooms.length;
        room.quantityAdults = quantityAdults;
        room.quantityChild = quantityChild;
        return [room];
      }
    }
    return optionRooms;
  }

  //#endregion

  changePayment(optionPaymentId: number, option) {
    new List<any>(option.prices).ForEach(price => {
      price.selected = (price.optionPaymentId === optionPaymentId ? !price.selected : false);
    });

    option.price = option.prices.find(price => price.optionPaymentId === optionPaymentId);
  }

  async getPayments(option) {
    if (this.loadingPayment) {
      return;
    }

    this.loadingPayment = true;

    const entityFilter = {
      //token: this.token,
      airId: option.numberRoom,
      planDailyUsed: option.price.planDailyUsed,
      planPointUsed: this.availablePoints,
      totalPrice: option.price.totalPrice
    };

    await this.detailService.searchPayment(entityFilter).then(resultPayment => {
      if (resultPayment && resultPayment.calculationProducts && resultPayment.calculationProducts.length > 0) {
        option.prices = new List<any>(resultPayment.calculationProducts)
          .OrderBy(price => price.paymentOptionId)
          .ToArray();

        if (option.prices && option.prices.length > 0) {
          option.prices[0].selected = true;
          option.price = option.prices[0];
        }        
      }

      this.hideLoading();

    }).catch(error => {
      this.hideLoading();
    });
  }

  hideLoading() {
    const funTimeOut = setTimeout(() => {
      this.loading = false;
      this.loadingPayment = false;
      this.time = 600;
      clearTimeout(funTimeOut);
    }, this.time);
  }
}
