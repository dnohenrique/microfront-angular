import { Component, DoCheck, ViewEncapsulation, Input, IterableDiffers, Inject } from '@angular/core';
import { String } from 'typescript-string-operations';
import { Common } from '../../../shared/support/common';
import { List } from 'linqts';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import HotelSimulatorModel from '../../models/hotel-simulator.model';
import { AvailabilityConfig } from '../../../availability-config.model';


@Component({
  selector: 'fc-availability-simulator-list-hotel',
  templateUrl: './simulator-list-hotel.component.html',
  styleUrls: ['./simulator-list-hotel.component.scss']
})
export class SimulatorListHotelComponent implements DoCheck {
  differ: any;

  constructor(
    public common: Common,
    differs: IterableDiffers,
    private router: Router,
    private deviceService: DeviceDetectorService,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
  ) {
    this.differ = differs.find([]).create(null);

    window.addEventListener('resize', (event) => {
      this.generatePagination();
    });
  }

  @Input() entity: HotelSimulatorModel;
  @Input() dataHotel: any;

  // Paginação
  pageCount = 0;
  dataCount = 0;
  pageNumber = 1;
  countPage: number;
  registersPerPage = 20;
  records: any;
  paginationButtons: any[] | undefined;
  viewHotels = [];

  ngDoCheck(): void {
    const change = this.differ.diff(this.dataHotel);
    if (change !== null) {
      this.pageNumber = 1;
      this.dataCount = this.dataHotel.length;
      this.pageCount = Math.ceil(this.dataCount / this.registersPerPage);
      this.Pagination();
    }
  }


  goToDetail(hotel) {
    const param = this.common.setUrlSearchSimulatorParams(this.entity.hotelSimulatorFilter);
    const url = String.Format(this.availabilityConfig.urlStaticDetail + '/{0}/{1}', param, hotel.hotelId);
    this.router.navigate([url]);
  }


  //#region Paginação
  Pagination(): void {
    let skip = 0;
    skip = this.registersPerPage * (this.pageNumber - 1);
    this.viewHotels = [];

    if (this.dataHotel.length > 0) {
      this.viewHotels = new List<any>(this.dataHotel).Skip(skip).Take(this.registersPerPage).ToArray();
    }

    this.generatePagination();
  }

  changeRegistersPerPage(): void {
    this.pageNumber = 1;
    this.pageCount = Math.ceil(this.viewHotels.length / this.registersPerPage);
    this.common.toScrollTop();
    this.Pagination();
  }

  firstPage(): void {
    this.pageNumber = 1;
    this.common.toScrollTop();
    this.Pagination();
  }

  backPage(): void {
    this.pageNumber--;
    this.common.toScrollTop();
    this.Pagination();
  }

  goTo(page: any): void {
    this.pageNumber = page;
    this.common.toScrollTop();
    this.Pagination();
  }

  nextPage(): void {
    this.pageNumber++;
    this.common.toScrollTop();
    this.Pagination();
  }

  lastPage(): void {
    this.pageNumber = this.pageCount;
    this.common.toScrollTop();
    this.Pagination();
  }

  generatePagination(): void {
    this.paginationButtons = [];
    // const countPage = this.deviceService.isMobile() ? 3 : 5;
    this.countPage = window.matchMedia('(max-width: 450px)').matches ? 4 : 5;

    let x = Math.ceil((this.countPage - 0) / 2);
    let y = (this.countPage - x);

    while ((this.pageNumber - x) < 0) {
      x--;
      y++;
    }

    while ((this.pageNumber + y) > this.pageCount) {
      y--;
      x++;
    }

    while ((this.pageNumber - x) < 0) {
      x--;
    }

    for (let i = (this.pageNumber - x); i < this.pageNumber; i++) {
      const aux = { page: i + 1 };
      this.paginationButtons.push(aux);
    }

    for (let i = this.pageNumber; i < (this.pageNumber + y); i++) {
      const aux = { page: i + 1 };
      this.paginationButtons.push(aux);
    }
  }
  // #endregion

}
