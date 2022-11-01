import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { Common } from '../shared/support/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { List } from 'linqts';
import { SimulatorFilterService } from './services/simulator-filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import HotelSimulatorModel from '../simulator-list/models/hotel-simulator.model';
import { AvailabilityConfig } from '../availability-config.model';
declare var $: any;

@Component({
  selector: 'fc-availability-simulator-filter',
  templateUrl: './simulator-filter.component.html',
  styleUrls: ['./simulator-filter.component.scss']
})
export class SimulatorFilterComponent implements OnInit {
  @Input() isPageList = false;
  @Input() isHome = false;
  @Output() changeDestinationFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickSearch: EventEmitter<any> = new EventEmitter<any>();
  cityFocus = false;
  citys = [];
  timeout: any = null;
  destination: any;
  entity: HotelSimulatorModel = {
    hotelSimulatorFilter: {
      planType: 1,
      cityId: 0,
      destinationText: ''
    }
  };
  loadingAutoComplete = false;

  messaError = {
    destination: false
  };

  constructor(
    private deviceService: DeviceDetectorService,
    private simulatorFilterService: SimulatorFilterService,
    private actRouter: ActivatedRoute,
    private router: Router,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig,
    public common: Common
  ) { }

  ngOnInit() {
    const paramEntity = this.common.getUrlSearchSimulatorParams(this.actRouter);
    this.citys = this.getLocalStorage('destinations-simulator');

    if (paramEntity !== undefined) {
      if (this.citys.length === 0 || !new List<any>(this.citys[0].children).Any(c =>
        c.id === paramEntity.hotelSimulatorFilter.cityId)) {
        this.loadAutoComplete(paramEntity.hotelSimulatorFilter.destinationText);
      }

      this.entity = paramEntity;
    } else {
      this.loadAutoComplete('');
    }

  }

  loadAutoComplete(searchText: string) {

    if (searchText.length >= 3) {

      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.loadingAutoComplete = true;
        this.simulatorFilterService.getAutoComplete(searchText.trim()).then(result => {
          if (result.result.autoCompleteResult.groupAutoComplete.length > 0) {
            this.citys = result.result.autoCompleteResult.groupAutoComplete;

          } else {
            this.citys = this.getLocalStorage('destinations-simulator');
            this.entity.hotelSimulatorFilter.cityId = 0;
          }
          this.loadingAutoComplete = false;
        });
      }, 300);

    } else {
      clearTimeout(this.timeout);
      this.citys = [];
    }
  }

  selectedCity(value) {
    if (value.length > 0) {
      this.destination = value[0];
      if (this.destination.active !== undefined && this.destination.active) {
        const dataDestination = {
          id: this.destination.data.id,
          name: this.destination.data.name,
          hotelId: this.destination.data.hotelId
        };
        this.addLocalStorage('destinations-simulator', dataDestination);
        this.cityFocus = false;
        this.entity.hotelSimulatorFilter.destinationText = this.destination.data.name;
        this.entity.hotelSimulatorFilter.cityId = this.destination.data.id;
      }
    }
  }

  addLocalStorage(key, itemData) {
    const data = this.getLocalStorage(key);
    if (data.length === 0 || !new List<any>(data[0].children).Any(d => d.id === itemData.id)) {
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
    if (children !== null) {
      data = [{
        name: 'Suas Últimas Buscas',
        children
      }];
    }

    return data;
  }

  focusAutoCompleteCity() {
    this.messaError.destination = false;
    this.cityFocus = true;
    this.changeDestinationFocus.emit(true);
  }

  blurAutoCompleteCity() {
    this.cityFocus = false;
    this.changeDestinationFocus.emit(false);
  }

  search() {
    this.messaError = {
      destination: false
    };

    if (!this.entity.hotelSimulatorFilter.cityId) {
      this.messaError.destination = true;
      return;
    }

    const param = this.common.setUrlSearchSimulatorParams(this.entity.hotelSimulatorFilter);
    const urlNavigate = this.availabilityConfig.urlStaticList + '/' + param;

    this.clickSearch.emit(this.entity);
    this.router.navigate([urlNavigate]);

  }
}
