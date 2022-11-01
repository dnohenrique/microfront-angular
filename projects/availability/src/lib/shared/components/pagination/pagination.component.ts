import { Component, OnInit, Input, DoCheck, IterableDiffers, EventEmitter, Output } from '@angular/core';
import { Common } from '../../support/common';
import { List } from 'linqts';

@Component({
  selector: 'fc-availability-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, DoCheck {

  pageCount = 0;
  dataCount = 0;
  pageNumber = 1;
  countPage: number;
  records: any;
  viewDatas: any;
  direction = 'bottom';
  paginationButtons: any[] | undefined;
  @Input() id: string;
  @Input() registersPerPage;
  @Input() datas: any[];
  @Input() cssScrollTop: string;
  @Input() loading = false;
  @Output() paginationEvent: EventEmitter<object> = new EventEmitter();

  differ: any;

  constructor(
    differs: IterableDiffers,
    private common: Common) {
    this.differ = differs.find([]).create(null);

    window.addEventListener('resize', (event) => {
      this.generatePagination();
    });
  }
  ngOnInit(): void {
    this.pageNumber = 1;
    this.dataCount = this.datas.length;
    this.pageCount = Math.ceil(this.dataCount / this.registersPerPage);
    this.Pagination();
  }

  ngDoCheck(): void {
    const change = this.differ.diff(this.datas);
    if (change !== null) {
      this.pageNumber = 1;
      this.dataCount = this.datas.length;
      this.pageCount = Math.ceil(this.dataCount / this.registersPerPage);
      this.Pagination();
    }
  }

  Pagination(): void {
    let skip = 0;
    skip = this.registersPerPage * (this.pageNumber - 1);
    this.viewDatas = [];

    if (this.datas.length > 0) {
      this.viewDatas = new List<any>(this.datas).Skip(skip).Take(this.registersPerPage).ToArray();
    }

    this.generatePagination();

    setTimeout(() => {
      this.paginationEvent.emit(this.viewDatas);
    });
  }

  changeRegistersPerPage(): void {
    this.pageNumber = 1;
    this.pageCount = Math.ceil(this.viewDatas.length / this.registersPerPage);
    this.common.toScrollTop();
    this.Pagination();
  }

  firstPage(): void {
    this.pageNumber = 1;
    this.common.toScrollTop(this.cssScrollTop);
    this.Pagination();
  }

  backPage(): void {
    this.pageNumber--;
    this.common.toScrollTop(this.cssScrollTop);
    this.Pagination();
  }

  goTo(page: any): void {
    this.pageNumber = page;
    this.common.toScrollTop(this.cssScrollTop);
    this.Pagination();
  }

  nextPage(): void {
    this.pageNumber++;
    this.common.toScrollTop(this.cssScrollTop);
    this.Pagination();
  }

  lastPage(): void {
    this.pageNumber = this.pageCount;

    this.common.toScrollTop(this.cssScrollTop);

    this.Pagination();
  }

  generatePagination(): void {
    this.paginationButtons = [];
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
}
