import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isDestinationFocus: boolean;
  isRoomsFocus: boolean;
  isCheckinFocus: boolean;
  isCheckoutFocus: boolean;
  constructor() { }

  ngOnInit() {
  }

  changeDestinationFocus(focus) {
    this.isDestinationFocus = focus;
  }

  changeRoomsFocus(focus) {
    this.isRoomsFocus =  focus;
  }

  changeCheckinFocus(focus) {
    this.isCheckinFocus = focus;
  }

  changeCheckoutFocus(focus) {
    this.isCheckoutFocus = focus;
  }

}
