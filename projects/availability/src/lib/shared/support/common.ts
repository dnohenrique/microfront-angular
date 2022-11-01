import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import SearchModel from '../models/search.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import AvailabilityModel from '../models/search.availability.model';
import { String } from 'typescript-string-operations';
import { List } from 'linqts';
import { EncryptoDecryptoService } from './encrypto.decrypto.service';
import SearchIataModel from '../models/search.iata.model';
import SearchIataLocaleModel from '../models/search.iata.locale.model';
import SearchRoomModel from '../models/search.room.model';
import HotelSimulatorFilterModel from '../../simulator-list/models/hotel-simulator-filter.model';
import HotelSimulatorModel from '../../simulator-list/models/hotel-simulator.model';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import 'moment/locale/pt-br';
import * as moment_ from 'moment';
const moment = moment_;
declare var $: any;
@Injectable()
export class Common {

  constructor(
    private pageScrollService: PageScrollService,
    private EncryptoDecrypto: EncryptoDecryptoService,
    private router: Router,
    private titleService: Title,
    @Inject(DOCUMENT) private document: any) {
    moment.locale('pt-BR');
  }

  hotelNotImage = 'https://static.ferias.co/images/hotel_not_image.jpg';
  typesPlan = [{
    id: 1,
    name: 'Todos',
    selected: true
  },
  {
    id: 2,
    name: 'Plano Padrão',
    selected: false
  },
  {
    id: 3,
    name: 'Plano Superior',
    selected: false
  },
  {
    id: 4,
    name: 'Plano Especial',
    selected: false
  },
  {
    id: 5,
    name: 'Plano Premium',
    selected: false
  },
  {
    id: 6,
    name: 'Plano Exclusivo',
    selected: false
  }];

  listOrder: any[] = [{
    id: 0,
    name: 'Relevância',
    selected: true
  }, {
    id: 1,
    name: 'Estrelas: Menor a maior',
    selected: false
  }, {
    id: 2,
    name: 'Estrelas: Maior a menor',
    selected: false
  }, {
    id: 3,
    name: 'Avaliação: Menor a maior',
    selected: false
  }, {
    id: 4,
    name: 'Avaliação: Maior a menor',
    selected: false
  }, {
    id: 5,
    name: 'Extra: Menor a maior',
    selected: false
  }, {
    id: 6,
    name: 'Extra: Maior a menor',
    selected: false
  }];

  setPageTitle(title: string) {
    this.titleService.setTitle(title + ' - Férias & Co');
  }

  getUrlParams(actRouter: ActivatedRoute) {
    actRouter.params.forEach((a) => {
      if (a.parameter != null) {
        return a.parameter;
      }
    });
  }

  getUrlSearchParams(actRouter: ActivatedRoute): SearchModel {
    let entity: SearchModel;
    actRouter.params.forEach((a) => {
      if (a.parameter && a.productId === '1') {
        entity = new SearchModel();
        entity.availabilityFilter = new AvailabilityModel();

        const param = this.EncryptoDecrypto.get(decodeURIComponent(a.parameter));

        const lisParam = param.split('|@');

        // 2-checkin,  3-checkout, 5-numberOfNights, 6-hotel Id, 7 - Broker Id, 8 - Token, 9 - Show modal session expired
        entity.availabilityFilter.checkin = lisParam[2];
        entity.availabilityFilter.checkout = lisParam[3];
        entity.availabilityFilter.checkinDate = this.ToDate(lisParam[2]);
        entity.availabilityFilter.checkoutDate = this.ToDate(lisParam[3]);
        entity.availabilityFilter.numberOfNights = this.toNumber(lisParam[5]);
        entity.availabilityFilter.brokerId = this.toNumber(lisParam[7]);
        entity.availabilityFilter.hotelId = 0;
        entity.availabilityFilter.token = lisParam[8];
        entity.availabilityFilter.userId = lisParam[10];
        entity.availabilityFilter.planId = lisParam[11];

        if (lisParam[9] && lisParam[9] !== 'undefined') {
          entity.availabilityFilter.showModalSessionExpired = this.toNumber(lisParam[9]);
          entity.availabilityFilter.token = '';
          entity.availabilityFilter.planId = '';
        }

        if (lisParam[12] && lisParam[12] !== 'undefined') {
          entity.availabilityFilter.isRecommend = lisParam[12] === 'recomendado';
        }

        if (a.id !== undefined) {
          entity.availabilityFilter.hotelId = a.id;
        }

        // 0 - Destino Id , 1 - Descricao Destino
        const paramDestination = lisParam[0].split('|');
        entity.availabilityFilter.iata = new SearchIataModel();
        entity.availabilityFilter.iata.locale = new SearchIataLocaleModel();
        entity.availabilityFilter.destinationValue = this.toNumber(paramDestination[0]);
        entity.availabilityFilter.iata.locale.city_id = this.toNumber(paramDestination[0]);
        entity.availabilityFilter.destinationText = paramDestination[1];

        // 0 - Id Quarto,  1- qtdAdult, 2 - Crianças(idades), 4 - Quantidade Hospede
        const paramRooms = JSON.parse(lisParam[1]);
        let countAdult = 0;
        let countChd = 0;
        entity.availabilityFilter.qtdRooms = paramRooms.length;
        entity.availabilityFilter.rooms = [];
        entity.availabilityFilter.qtdHospede = this.toNumber(lisParam[4]);
        new List<any>(paramRooms).ForEach(room => {
          const filterRoom = new SearchRoomModel();
          const paramRoom = room.split('|');
          const paramAges = paramRoom[2] != null ? JSON.parse(paramRoom[2]) : [];

          filterRoom.id = this.toNumber(paramRoom[0]);
          filterRoom.quantityAdults = this.toNumber(paramRoom[1]);
          filterRoom.quantityChild = paramAges.length;
          filterRoom.childAgesCustom = paramAges;
          filterRoom.childAges = new List<any>(paramAges).Select(p => p.age).ToArray();

          entity.availabilityFilter.rooms.push(filterRoom);
          countAdult += filterRoom.quantityAdults;
          countChd += filterRoom.quantityChild;
        });

        entity.availabilityFilter.qtdAdult = countAdult;
        entity.availabilityFilter.qtdChild = countChd;
      }
    });

    return entity;
  }

  formatPoints(points) {
    if (points > 0) {
      return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return '';
  }

  setUrlSearchParams(availability: AvailabilityModel): string {
    const entity = Object.assign({}, availability);

    // 0 - Destino Id , 1 - Descricao Destino
    const strDestination = String.Format('{0}|{1}',
      entity.iata.locale.city_id,
      entity.destinationText.replace(new RegExp('[/]', 'gi'), '-'));

    // 0 - Id Quarto, 1 - Quantidade Hospede , 2 - Crianças(idades)
    const strRooms = JSON.stringify(new List<SearchRoomModel>(entity.rooms).Select(room =>
      String.Format('{0}|{1}|{2}', room.id, room.quantityAdults, JSON.stringify(room.childAgesCustom))
    ).ToArray());


    /*
      0-Destino Id | Descricao Destino
      1-Quantidade Hospede | Crianças(idades)
      2-checkin
      3-checkout
      4-qtdHospede
      5-numberOfNights
      6-Hotel Id
      7-Broker Id
      8-Token
      9-Show modal session expired
      10-User Id
      11-Plan Id
     */
    const strParam = String.Format('{0}|@{1}|@{2}|@{3}|@{4}|@{5}|@{6}|@{7}|@{8}|@{9}|@{10}|@{11}',
      strDestination,
      strRooms,
      entity.checkin,
      entity.checkout,
      entity.qtdHospede,
      entity.numberOfNights,
      entity.hotelId,
      entity.brokerId,
      entity.token || '',
      entity.showModalSessionExpired || '',
      entity.userId || '',
      entity.planId || ''
    );

    const tokenSearch = encodeURIComponent(this.EncryptoDecrypto.set(strParam));

    localStorage.setItem('tokenSearch', tokenSearch);
    return tokenSearch;
  }

  setUrlSearchSimulatorParams(hotelSimulator: HotelSimulatorFilterModel): string {
    const entity = Object.assign({}, hotelSimulator);

    /*
      0-Destino Id | Descricao Destino
      1-Plano Id Tipo
     */
    const strParam = String.Format('{0}/{1}/{2}',
      entity.cityId,
      entity.planType,
      entity.destinationText
    );

    const tokenSearch = encodeURIComponent(this.EncryptoDecrypto.set(strParam));

    localStorage.setItem('tokenSearchSimulator', tokenSearch);
    return tokenSearch;
  }

  getUrlSearchSimulatorParams(actRouter: ActivatedRoute): HotelSimulatorModel {
    let entity: HotelSimulatorModel;
    actRouter.params.forEach((a) => {
      if (a.parameter != null) {
        entity = new HotelSimulatorModel();
        entity.hotelSimulatorFilter = new HotelSimulatorFilterModel();

        const param = this.EncryptoDecrypto.get(decodeURIComponent(a.parameter));
        const lisParam = param.split('/');
        entity.hotelSimulatorFilter.cityId = Number(lisParam[0]);
        entity.hotelSimulatorFilter.planType = Number(lisParam[1]);
        entity.hotelSimulatorFilter.destinationText = lisParam[2];

        if (a.id != null) {
          entity.hotelSimulatorFilter.hotelId = a.id;
        }
      }
    });

    return entity;
  }

  setUrlBookingParams(availability: AvailabilityModel, option: any, hotel: any): string {
    const entity = Object.assign({}, availability);

    // 0 - Destino Id , 1 - Descricao Destino
    const strDestination = String.Format('{0}|{1}',
      entity.iata.locale.city_id,
      entity.destinationText.replace(new RegExp('[/]', 'gi'), '-'));

    // 0 - Id Quarto, 1 - Quantidade Hospede , 2 - Crianças(idades)
    const strRooms = JSON.stringify(new List<SearchRoomModel>(entity.rooms).Select(room =>
      String.Format('{0}|{1}|{2}', room.id, room.quantityAdults, JSON.stringify(room.childAgesCustom))
    ).ToArray());

    const roomIds = new List<any>(option.rooms).Select(room => room.roomId.toString()).ToArray();

    if (roomIds.length < availability.rooms.length) {
      for (let index = 0; index < availability.rooms.length - 1; index++) {
        roomIds.push(roomIds[0]);
      }
    }

    const roomsIdsString = JSON.stringify(roomIds);

    const strParam = String.Format('{0}|@{1}|@{2}|@{3}|@{4}|@{5}|@{6}|@{7}|@{8}|@{9}|@{10}|@{11}|@{12}|@{13}',
      strDestination,
      entity.checkin,
      entity.checkout,
      option.rooms[0].providerName,
      hotel.token,
      option.rooms[0].brokerId,
      entity.hotelId,
      roomsIdsString,
      entity.qtdHospede,
      strRooms,
      option.rooms[0].brokerHotelId,
      option.rooms[0].brokerToken,
      option.price.optionPaymentId,
      option.price.planDailyUsed
    );

    return encodeURIComponent(this.EncryptoDecrypto.set(strParam));
  }

  getNumberToArray(length) {
    return new Array(length);
  }

  toNumber(value) {
    if (value === undefined || value === null) {
      return 0;
    } else { return Number(value); }
  }

  toScrollTop(section = 'top', duration = 500) {
    if (section === 'top') {
      section = 'body';
      duration = 0;
    }

    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: section,
      duration
    });

  }

  hideBodyScroll() {
    $('html').css('overflow', 'hidden');
  }

  showBodyScroll() {
    $('html').css('overflow', 'auto');
  }


  ToNgbDate(dateText: string): NgbDate {
    let date: NgbDate;
    if (dateText !== undefined) {
      const day = Number(dateText.substring(0, 2));
      const month = Number(dateText.substring(2, 4));
      const year = Number(dateText.substring(4));

      date = new NgbDate(year, month, day);
    }
    return date;
  }
  getToday() {
    return moment().format('DDMMYYYY');
  }

  getDatePlus(day, month) {
    return moment().add(day, 'days').add(month, 'month').format('DDMMYYYY');
  }

  getDatePlusDay(date, day) {
    return moment(date, 'DDMMYYYY').add(day, 'days').format('DDMMYYYY');
  }

  getDateString(date) {
    return moment(date).format('DDMMYYYY');
  }

  ToDate(date: string) {
    const day = Number(date.substring(0, 2));
    const month = Number(date.substring(2, 4));
    const year = Number(date.substring(4));

    return new Date(year, (month - 1), day);
  }

  Contains(text: string, text2: string): boolean {
    return this.RemoveAcento(text).indexOf(this.RemoveAcento(text2)) > -1;
  }

  padLeft(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  RemoveAcento(text: string): string {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
  }

  calculateDate(date1, date2) {
    const diffc = date1.getTime() - date2.getTime();
    const days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }

  verifyIsMobile() {
    return window.matchMedia('(max-width: 657px)').matches ? true : false;
  }

  verifyIsTablet() {
    return window.matchMedia('(min-width: 658px) and (max-width: 1199px)').matches ? true : false;
  }
}
