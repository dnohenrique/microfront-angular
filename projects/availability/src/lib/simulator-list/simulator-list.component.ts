import { Component, OnInit, HostListener } from '@angular/core';
import { Common } from '../shared/support/common';
import { ActivatedRoute } from '@angular/router';
import HotelModel from '../list/models/hotel.model';
import HotelSimulatorModel from './models/hotel-simulator.model';
import { SimulatorListService } from './services/simulator-list.service';
import { List } from 'linqts';
declare var $: any;

@Component({
  selector: 'fc-availability-simulator-list',
  templateUrl: './simulator-list.component.html',
  styleUrls: ['./simulator-list.component.scss']
})

export class SimulatorListComponent implements OnInit {
  entity: HotelSimulatorModel = {
    hotelSimulatorFilter: {
      planType: 1,
      cityId: 0,
      destinationText: ''
    }
  };
  dataHotel = [];
  listHotelFilter = [];
  countHotels: number;
  msgNotResult: boolean;
  namePlan: string;
  viewSearch = false;
  viewOrder = false;
  viewFilter = false;
  viewFilterOrder = false;
  order = 1;

  constructor(
    public common: Common,
    private actRouter: ActivatedRoute,
    private simulatorListService: SimulatorListService
  ) { }

  ngOnInit() {
    this.common.toScrollTop();
    const param = this.common.getUrlSearchSimulatorParams(this.actRouter);
    this.common.listOrder = new List<any>(this.common.listOrder).Where(o => o.id !== 0).ToArray();
    if (param !== undefined && param.hotelSimulatorFilter.cityId > 0) {
      this.entity = param;
      this.dataHotel = [];
      this.selectTypePlan({ id: this.entity.hotelSimulatorFilter.planType }, null, false);
      this.resultSearch(param);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    this.viewFilterOrder = verticalOffset < ($('.list-content').height() + 100);
  }

  resultSearch(param: HotelSimulatorModel = null) {
    this.entity.hotelSimulatorFilter.destinationText = param.hotelSimulatorFilter.destinationText;
    this.viewSearch = false;
    this.closeFilter();
    this.msgNotResult = false;
    this.simulatorListService.search(param).then(data => {
      this.dataHotel = data.result.hotels;
      this.countHotels = this.dataHotel.length;
      if (this.countHotels === 0) {
        this.msgNotResult = true;
      }
    }).catch(result => {
      this.msgNotResult = true;
      this.countHotels = 0;
    });
  }

  selectTypePlan(itemSelected, event, isSearch = true) {
    if (event != null && !event.target.checked) {
      event.target.checked = true;
    } else {
      this.common.typesPlan = new List<any>(this.common.typesPlan).Select(o => {
        const selected = itemSelected.id === o.id;
        if (selected) {
          this.namePlan = o.name;
        }

        return {
          id: o.id,
          name: o.name,
          selected
        };
      }).ToArray();

      this.entity.hotelSimulatorFilter.planType = itemSelected.id;

      if (isSearch) {
        this.resultSearch();
      }
    }
  }

  orderHotelMobile(itemSelected) {
    new List<any>(this.common.listOrder).Where(o => itemSelected.id !== o.id).ForEach(o => o.selected = false);
  }

  closeOrder() {
    this.viewOrder = false;
    this.common.showBodyScroll();
    const list = new List<any>(this.common.listOrder);
    list.ForEach(o => o.selected = false);
    list.Where(o => o.id === this.order).ForEach(o => o.selected = true);
  }

  orderHotel(scrollTop = true, isDesktop = false) {
    if (!isDesktop) {
      this.common.showBodyScroll();
      this.viewOrder = false;
      const itemSelected = new List<any>(this.common.listOrder).FirstOrDefault(o => o.selected);
      this.order = itemSelected.id;
      if (scrollTop) {
        this.common.toScrollTop();
      }
    }
    const hotels = Object.assign([], this.dataHotel);
    switch (this.order) {
      default:
      case 1:
        this.dataHotel = new List<HotelModel>(hotels).OrderBy(h => h.category).ToArray();
        break;
      case 2:
        this.dataHotel = new List<HotelModel>(hotels).OrderByDescending(h => h.category).ToArray();
        break;
    }
  }

  viewMobileOrder() {
    this.common.hideBodyScroll();
    this.viewOrder = true;
  }

  viewMobileFilter() {
    this.common.hideBodyScroll();
    this.viewFilter = true;
  }

  closeFilter() {
    this.common.showBodyScroll();
    this.viewFilter = false;
  }
}
