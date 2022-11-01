import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotsite-filter',
  templateUrl: './hotsite-filter.component.html',
  styleUrls: ['./hotsite-filter.component.scss']
})
export class HotsiteFilterComponent implements OnInit {
  isDestinationFocus: boolean;
  constructor() { }

  ngOnInit() {
  }

  changeDestinationFocus(focus) {
    this.isDestinationFocus = focus;
  }
}
