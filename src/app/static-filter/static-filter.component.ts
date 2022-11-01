import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-static-filter',
  templateUrl: './static-filter.component.html',
  styleUrls: ['./static-filter.component.scss']
})
export class StaticFilterComponent implements OnInit {
  isDestinationFocus: boolean;
  constructor() { }

  ngOnInit() {
  }

  changeDestinationFocus(focus) {
    this.isDestinationFocus = focus;
  }
}
