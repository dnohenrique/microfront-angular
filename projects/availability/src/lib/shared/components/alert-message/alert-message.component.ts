import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fc-availability-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {

  @Input() textAlert: string;
  @Input() subTextAlert: string;

  constructor() { }

  ngOnInit() {
  }

}
