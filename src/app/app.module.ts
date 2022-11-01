import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListComponent } from './list/list.component';
import { AvailabilityModule } from 'projects/availability/src/lib/availability.module';
import { AvailabilityConfig } from 'projects/availability/src/lib/availability-config.model';
import { environment } from 'src/environments/environment';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HotsiteListComponent } from './hotsite-list/hotsite-list.component';
import { HotsiteFilterComponent } from './hotsite-filter/hotsite-filter.component';
import { HotsiteDetailComponent } from './hotsite-detail/hotsite-detail.component';
import { FilterSearchModule } from 'projects/availability/src/lib/filter-search/filter-search.module';
import { DetailModule } from 'projects/availability/src/lib/detail/detail.module';
import { ListModule } from 'projects/availability/src/lib/list/list.module';

import { StaticFilterComponent } from './static-filter/static-filter.component';
import { StaticDetailComponent } from './static-detail/static-detail.component';
import { StaticListComponent } from './static-list/static-list.component';
import { SimulatorFilterModule } from 'projects/availability/src/lib/simulator-filter/simulator-filter.module';
import { SimulatorListModule } from 'projects/availability/src/lib/simulator-list/simulator-list.module';
import { SimulatorDetailModule } from 'projects/availability/src/lib/simulator-detail/simulator-detail.module';

const customAvailability: AvailabilityConfig = {
  apiAvailabilityUrl: environment.urlApiAvaliability,
  urlRedirectBooking: environment.urlBooking,
  apiUrlBff: environment.urlBFF,
  urlKrakenql: environment.urlApi,
  urlRedirectDetail: 'detail',
  urlRedirectList: 'list/',
  urlSimulatorList: 'hotsite/list',
  urlSimulatorDetail: 'hotsite/detail',
  urlStaticList: 'static/list',
  urlStaticDetail: 'static/detail',
  isNewAba: true
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    DetailComponent,
    HotsiteListComponent,
    HotsiteFilterComponent,
    HotsiteDetailComponent,
    StaticFilterComponent,
    StaticDetailComponent,
    StaticListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AvailabilityModule.forRoot(customAvailability),
    FilterSearchModule,
    DetailModule,
    ListModule,
    SimulatorFilterModule,
    SimulatorListModule,
    SimulatorDetailModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot()
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    this.insertStyles();
  }

  insertStyles() {
    const elm = document.createElement('link');
    elm.setAttribute('rel', 'stylesheet');
    elm.setAttribute('type', 'text/css');
    elm.href = environment.fcStyles;
    document.head.appendChild(elm);
  }
}

