import { Component, ViewEncapsulation, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'reservas';

  ngOnInit() {
    sessionStorage.setItem('acc', '86300357000100');
    sessionStorage.setItem('xdc', '32520535512');
    sessionStorage.setItem('dd', '5');

  }
}
