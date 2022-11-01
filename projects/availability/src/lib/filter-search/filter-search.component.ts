import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output, Inject } from '@angular/core';
import { AutocompleteService } from './services/autocomplete.service';
import SearchModel from '../shared/models/search.model';
import { List } from 'linqts';
import SearchRoomModel from '../shared/models/search.room.model';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Common } from '../shared/support/common';
import { String } from 'typescript-string-operations';
import AvailabilityModel from '../shared/models/search.availability.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DatePipe } from '@angular/common';
import { AvailabilityConfig } from '../availability-config.model';
import { PlanService } from '../shared/services/plan.service';

declare var $: any;

@Component({
  selector: 'fc-availability-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss']
})
export class FilterSearchComponent implements OnInit {

  entity: SearchModel = {
    availabilityFilter: new AvailabilityModel()
  };
  @Input() isPageList = false;
  @Input() isTitle = false;
  @Input() simulator = false;
  @Input() onlyCity = false;
  @Input() isHome = false;
  @Input() planIdDefault: string;
  @Output() clickSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeDestinationFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeRoomsFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeCheckinFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeCheckoutFocus: EventEmitter<any> = new EventEmitter<any>();
  @Input() loading: boolean;
  citys: any = [];
  ages: any = [];
  viewCalendar = false;
  focusCheckout = false;
  cityFocus = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  minDate: NgbDate;
  maxDate: NgbDate;
  viewRoom = false;
  startDate: NgbDate;
  timeout: any = null;
  displayMonths = 1;
  filterPlans = [];
  readonlyCalendar = false;
  bsInlineValue = new Date();
  pipe = new DatePipe('pt-BR');
  loadingAutoComplete = false;
  destination: any;
  messaError = {
    destination: false,
    checkin: false,
    checkout: false
  };
  todayNext: NgbDate;

  constructor(
    private autocompleteService: AutocompleteService,
    private common: Common,
    private calendar: NgbCalendar,
    private router: Router,
    private planService: PlanService,
    private actRouter: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
  ) {
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() + 1);
    this.todayNext = new NgbDate(dateToday.getFullYear(), dateToday.getMonth() + 1, dateToday.getDate());
    this.minDate = this.todayNext;
    this.startDate = calendar.getToday();
    this.toDate = null;
    if (this.deviceService.isMobile()) {
      this.readonlyCalendar = true;
    }
  }

  ngOnInit() {
    this.citys = this.getLocalStorage('destinations');
    const paramEntity = this.common.getUrlSearchParams(this.actRouter);

    if (paramEntity !== undefined) {
      if ((this.citys.length === 0 || !new List<any>(this.citys[0].children).Any(c =>
        c.id === paramEntity.availabilityFilter.destinationValue && c.hotelId === 0)) && paramEntity.availabilityFilter.isRecommend) {
        const dataDestination = {
          id: paramEntity.availabilityFilter.destinationValue,
          name: paramEntity.availabilityFilter.destinationText,
          hotelId: paramEntity.availabilityFilter.hotelId
        };
        this.addLocalStorage('destinations', dataDestination);
        this.citys = this.getLocalStorage('destinations');
      } else {
        if (this.citys.length === 0 || !new List<any>(this.citys[0].children).Any(c =>
          c.id === paramEntity.availabilityFilter.destinationValue)) {
          this.loadAutoComplete(paramEntity.availabilityFilter.destinationText);
        }
      }
      this.entity = paramEntity;
      this.fromDate = this.common.ToNgbDate(this.entity.availabilityFilter.checkin);
      this.startDate = this.fromDate;
      
      this.toDate = this.common.ToNgbDate(this.entity.availabilityFilter.checkout);
    } else {
      this.entity = new SearchModel();
      this.entity.availabilityFilter = new AvailabilityModel();
      this.entity.availabilityFilter.checkinDate = null;
      this.entity.availabilityFilter.checkoutDate = null;
      this.entity.availabilityFilter.rooms = [{
        id: 1,
        quantityAdults: 2,
        quantityChild: 0,
        childAgesCustom: [],
        childAges: [],
        maxHospedeAdult: 5,
        maxHospedeChild: 4
      }];
      if (this.simulator) {
        this.entity.availabilityFilter.checkin = this.common.getDatePlus(1, 5);
        
        this.entity.availabilityFilter.rooms[0].quantityAdults = 2;
        if (this.onlyCity) {
          this.planService.getPlans().then(result => {
            this.entity.availabilityFilter.planId = this.planIdDefault;
            this.filterPlans = result.plans;
            if (result.checkin) {
              this.entity.availabilityFilter.checkin = result.checkin;
            }
            this.entity.availabilityFilter.checkout = this.common.getDatePlusDay(this.entity.availabilityFilter.checkin, this.filterPlans[0].diarias);
          });
        }
      }
      this.entity.availabilityFilter.iata = {
        locale: {
          city_id: 0
        }
      };

      this.changeHospede();
    }

    if (this.isTitle) {
      this.setTitle();
    }

    for (let index = 0; index <= 17; index++) {
      this.ages.push({ id: index, name: (index === 0 ? 'Até 1 ano' : index) });
    }
  }

  selectedPlan(plan) {
    this.entity.availabilityFilter.planId = plan.id
    this.entity.availabilityFilter.checkout = this.common.getDatePlusDay(this.entity.availabilityFilter.checkin, plan.diarias);
  }

  //#region AutoComplete
  loadAutoComplete(searchText: string) {
    $('#autocompleteCity input').val(this.common.RemoveAcento(searchText));
    if (searchText.length >= 3) {

      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.loadingAutoComplete = true;
        this.autocompleteService.getAutoComplete(searchText.trim()).then(result => {
          if (result.result.autoCompleteResult.groupAutoComplete.length > 0) {
            this.citys = result.result.autoCompleteResult.groupAutoComplete;

          } else {
            this.citys = this.getLocalStorage('destinations');
            this.entity.availabilityFilter.iata.locale.city_id = 0;
          }

          this.loadingAutoComplete = false;
        });
      }, 300);

    } else {
      clearTimeout(this.timeout);
      this.citys = [];
    }
  }

  selectedCity(value: any) {
    if (value.length > 0) {
      this.destination = value[0];
      if (this.destination.active !== undefined && this.destination.active && this.destination.data.id) {
        const dataDestination = {
          id: this.destination.data.hotelId > 0 ? this.destination.data.hotelId : this.common.toNumber(this.destination.data.id),
          name: this.destination.data.name,
          hotelId: this.destination.data.hotelId
        };
        this.addLocalStorage('destinations', dataDestination);
        this.cityFocus = false;
        this.changeDestinationFocus.emit(false);
        this.entity.availabilityFilter.destinationText = this.destination.data.name;
        this.entity.availabilityFilter.destinationValue = this.common.toNumber(this.destination.data.id);
        this.entity.availabilityFilter.iata.locale.city_id = this.common.toNumber(this.destination.data.id);
        this.entity.availabilityFilter.hotelId = this.destination.data.hotelId;
      }
    } else {
      this.entity.availabilityFilter.destinationText = '';
      this.entity.availabilityFilter.destinationValue = 0;
      this.entity.availabilityFilter.iata.locale.city_id = 0;
      this.entity.availabilityFilter.hotelId = 0;
    }

    if (this.isTitle) {
      this.setTitle();
    }
  }

  addLocalStorage(key, itemData) {
    const data = this.getLocalStorage(key);
    if (data.length === 0 || !new List<any>(data[0].children)
      .Any(d => (d.id === itemData.id && d.hotelId === itemData.hotelId))) {
      const list = data.length > 0 ? data : [{ children: [] }];
      list[0].children.unshift(itemData);

      if (list[0].children.length >= 6) {
        list[0].children.pop();
      }
      localStorage.setItem(key, JSON.stringify(list[0].children));
    }
  }

  getLocalStorage(key) {
    const children = JSON.parse(localStorage.getItem(key));

    let data = [{ name: '', children: [] }];
    if (children !== null && children.length > 0) {
      data = [{
        name: 'Suas Últimas Buscas',
        children
      }];
    } else {
      data = [];
    }

    return data;
  }

  focusAutoCompleteCity() {
    this.messaError.destination = false;
    this.cityFocus = true;
    this.changeDestinationFocus.emit(true);

    if (this.deviceService.isMobile()) {
      $('#autocompleteCity .ngx-select__toggle.btn.form-control').click();
      this.common.toScrollTop();
    }
  }

  blurAutoCompleteCity() {
    this.cityFocus = false;
    this.changeDestinationFocus.emit(false);
  }
  //#endregion

  //#region  Quartos
  applyRoom() {
    this.viewRoom = false;
    this.changeRoomsFocus.emit(false);
  }

  changeHospede() {
    this.entity.availabilityFilter.qtdRooms = this.entity.availabilityFilter.rooms.length;
    this.entity.availabilityFilter.qtdAdult = new List<SearchRoomModel>(this.entity.availabilityFilter.rooms).Sum(r => r.quantityAdults);
    this.entity.availabilityFilter.qtdChild = new List<SearchRoomModel>(this.entity.availabilityFilter.rooms).Sum(r => r.quantityChild);
    this.entity.availabilityFilter.qtdHospede = this.entity.availabilityFilter.qtdAdult + this.entity.availabilityFilter.qtdChild;
  }

  clickOut(e) {
    const element = e.toElement || e.target;

    if (element.id.indexOf('addQuarto') === -1 && element.className.indexOf('fc-btn-danger') === -1
      && element.className.indexOf('del') === -1
      && element.className.indexOf('icon-lixeira') === -1 && element.className.indexOf('btn-room') === -1) {
      this.viewRoom = false;
      this.changeRoomsFocus.emit(false);

    }
  }
  viewRooms() {
    if (this.loading) {
      return true;
    }
    this.viewRoom = true;
    this.changeRoomsFocus.emit(true);

    // Quando o browser for Firefox desabilitar o click
    if (this.deviceService.browser === 'Firefox') {
      $('.number input').attr('disabled', 'disabled');
    }

    // Quando for versão mobile subir scrool ao topo
    if (this.deviceService.isMobile()) {
      this.common.toScrollTop();
    }
  }

  changeMaxQtd(room) {
    room.maxHospedeAdult = 5 - room.quantityChild;
    room.maxHospedeChild = 5 - room.quantityAdults;
  }

  changeAdult(room) {
    this.changeMaxQtd(room);
    this.changeHospede();
  }

  changeChild(room) {
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
    if (this.entity.availabilityFilter.rooms.length < 2) {
      this.entity.availabilityFilter.rooms.push({
        id: (this.entity.availabilityFilter.rooms.length + 1),
        quantityAdults: 2,
        quantityChild: 0,
        childAgesCustom: [],
        childAges: [],
        maxHospedeAdult: 8,
        maxHospedeChild: 7
      });
      this.changeHospede();
    }
  }

  removeRoom(room) {
    this.viewRoom = true;
    this.entity.availabilityFilter.rooms = new List<SearchRoomModel>(this.entity.availabilityFilter.rooms)
      .Where(r => r.id !== room.id).ToArray();
    this.changeHospede();
  }
  //#endregion

  //#region Checkin/Checkout
  showCalendar(isCheckout: boolean = false) {
    if (this.deviceService.isMobile()) {
      this.common.toScrollTop();
    }

    this.viewCalendar = true;
    this.changeCheckoutFocus.emit(isCheckout);
    this.focusCheckout = isCheckout;
    const isValidCheckout = this.entity.availabilityFilter.checkout !== undefined && this.entity.availabilityFilter.checkout !== '';

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
        this.startDate = this.common.ToNgbDate(this.entity.availabilityFilter.checkout);
      }
    } else {
      this.messaError.checkin = false;
      if (isValidCheckout) {
        this.startDate = this.common.ToNgbDate(this.entity.availabilityFilter.checkin);
      } else {
        this.fromDate = null;
        this.entity.availabilityFilter.checkin = null;
      }

      setTimeout(() => {
        $('#checkin').focus();
        this.changeCheckinFocus.emit(true);
        this.viewCalendar = true;
      });

      this.minDate = this.todayNext;
      this.maxDate = null;
    }
  }

  clickOutCalendar(e) {
    const element = e.toElement || e.target;

    if (element.id !== 'checkin' && element.id !== 'checkout'
      && element.id !== 'calendar-input' && element.id.indexOf('ApplyRoom') === -1) {
      this.viewCalendar = false;
      this.changeCheckinFocus.emit(false);
      this.changeCheckoutFocus.emit(false);
    }
  }

  changedCheckin() {
    if (this.entity.availabilityFilter.checkin.length === 8) {
      const date = this.common.ToNgbDate(this.entity.availabilityFilter.checkin);

      if (this.calendar.isValid(date) && (date.after(this.minDate) || date.equals(this.minDate))) {
        this.focusCheckout = true;
        this.changeCheckoutFocus.emit(true);
        this.fromDate = null;
        this.entity.availabilityFilter.checkout = '';
        this.onDateSelection(date);
        setTimeout(() => {
          $('#checkout').focus();
        });
      } else {
        this.entity.availabilityFilter.checkin = '';
        this.fromDate = null;
        setTimeout(() => {
          $('#checkin').val('');
        });
      }
    }
  }

  changedCheckout() {
    if (this.entity.availabilityFilter.checkout.length === 8) {

      const date = this.common.ToNgbDate(this.entity.availabilityFilter.checkout);

      const numberOfNights = this.common.calculateDate(this.common.ToDate(this.entity.availabilityFilter.checkin),
        this.common.ToDate(this.entity.availabilityFilter.checkout));

      if (this.calendar.isValid(date) && (date.after(this.fromDate) && numberOfNights <= 30)) {
        this.toDate = null;
        $('#checkout').blur();
        this.onDateSelection(date);
      } else {
        this.entity.availabilityFilter.checkout = '';
        this.toDate = null;
        setTimeout(() => {
          $('#checkout').val('');
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
        $('#checkout').focus();
      });

      this.fromDate = date;
      this.startDate = date;
      this.entity.availabilityFilter.checkin = dateFormat;

    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;

      this.entity.availabilityFilter.checkout = dateFormat;
      const dateFrom = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day);
      const dateTo = new Date(this.toDate.year, this.toDate.month, this.toDate.day);
      this.entity.availabilityFilter.numberOfNights = this.common.calculateDate(dateFrom, dateTo);
      this.viewCalendar = false;
    } else {
      this.focusCheckout = date.after(this.fromDate);
      this.fromDate = date;
      this.entity.availabilityFilter.checkout = '';

      this.toDate = null;
      this.entity.availabilityFilter.checkin = dateFormat;
      setTimeout(() => {
        $('#checkout').focus();
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

  search() {
    if (this.loading) {
      return true;
    }
    this.messaError = {
      destination: false,
      checkin: false,
      checkout: false
    };

    if (!this.entity.availabilityFilter.iata.locale.city_id) {
      this.messaError.destination = true;
      return;
    }

    if (!this.entity.availabilityFilter.checkin ||
      !this.calendar.isValid(this.common.ToNgbDate(this.entity.availabilityFilter.checkin))) {
      this.messaError.checkin = true;
      return;
    }

    if (!this.entity.availabilityFilter.checkout
      || !this.calendar.isValid(this.common.ToNgbDate(this.entity.availabilityFilter.checkout))) {
      this.messaError.checkout = true;
      return;
    }

    this.entity.availabilityFilter.numberOfNights = this.common.calculateDate(this.common.ToDate(this.entity.availabilityFilter.checkin),
      this.common.ToDate(this.entity.availabilityFilter.checkout));

    this.entity.availabilityFilter.showModalSessionExpired = 0;

    if (this.simulator) {
      this.entity.availabilityFilter.userId = '';
      this.entity.availabilityFilter.token = '';
    } else {
      this.entity.availabilityFilter.userId = sessionStorage.getItem('xdc');
    }

    const param = this.common.setUrlSearchParams(this.entity.availabilityFilter);
    let urlNavigate = this.availabilityConfig.urlRedirectList + param;

    if (this.simulator) {
      urlNavigate = this.availabilityConfig.urlSimulatorList + '/' + param;
    }

    this.entity.availabilityFilter.checkinDate = this.common.ToDate(this.entity.availabilityFilter.checkin);
    this.entity.availabilityFilter.checkoutDate = this.common.ToDate(this.entity.availabilityFilter.checkout);
    this.entity.availabilityFilter.hotelId = this.destination.data.hotelId;
    this.entity.availabilityFilter.token = null;

    if (this.simulator) {
      this.entity.availabilityFilter.userId = '';
    }

    if (this.entity.availabilityFilter.hotelId > 0) {
      urlNavigate = String.Format(
        '{0}/{1}/{2}/1', this.availabilityConfig.urlRedirectDetail, param, this.entity.availabilityFilter.hotelId
      );
    } else {
      urlNavigate = `${urlNavigate} /1`;
    }

    this.clickSearch.emit(this.entity);
    this.router.navigate([urlNavigate]);

  }

  setTitle() {

    let pageTitle = '';

    if (this.entity.availabilityFilter.hotelId) {
      pageTitle = this.entity.availabilityFilter.destinationText.split(',').shift();
    } else {
      pageTitle = 'Hospedagens ' + (this.entity.availabilityFilter.destinationText ?
        'em ' + this.entity.availabilityFilter.destinationText : '');
    }

    this.common.setPageTitle(pageTitle);
  }
}
