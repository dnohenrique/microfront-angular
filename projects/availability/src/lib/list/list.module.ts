import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ListHotelComponent } from './components/list-hotel/list-hotel.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../shared/services/http-client.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { Common } from '../shared/support/common';
import { NgxMaskModule } from 'ngx-mask';
import { ListService } from './services/list.service';
import { FilterSearchModule } from '../filter-search/filter-search.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AlertMessageModule } from '../shared/components/alert-message/alert-message.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ClickOutsideModule } from 'ng-click-outside';
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from '../shared/components/pagination/pagination.module';
import { GraphQLModule } from '../shared/modules/graphql.module';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { InfoMessageModule } from '../shared/components/info/info-message.module';

@NgModule({
    declarations: [
        ListComponent,
        ListHotelComponent
    ],
    imports: [
        HttpClientModule,
        FormsModule,
        CommonModule,
        ScrollingModule,
        FilterSearchModule,
        NgxSelectModule,
        DeviceDetectorModule.forRoot(),
        NgxMaskModule.forRoot(),
        AlertMessageModule,
        NgxPageScrollModule,
        ClickOutsideModule,
        PaginationModule,
        HttpLinkModule,
        ApolloModule,
        GraphQLModule,
        InfoMessageModule
    ],
    exports: [
        ListComponent,
        ListHotelComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'pt-PT' },
        Common,
        ListService,
        HttpClientService
    ]
})
export class ListModule { }
