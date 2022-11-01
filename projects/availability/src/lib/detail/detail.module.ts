import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterSearchModule } from '../filter-search/filter-search.module';
import { NgxMaskModule } from 'ngx-mask';
import { DetailService } from './services/detail.service';
import { AlertMessageModule } from '../shared/components/alert-message/alert-message.module';
import { DetailComponent } from './detail.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { GaleryImagesModule } from '../shared/components/galery-images/galery-images.module';
import { GalleryThumbModule  } from '../shared/components//gallery-thumb/gallery-thumb.module';
import { MapModule } from '../shared/components/map/map.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { RoomComponent } from './components/room/room.component';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { PaginationModule } from '../shared/components/pagination/pagination.module';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloModule } from 'apollo-angular';
import { GraphQLModule } from '../shared/modules/graphql.module';
import { NgbModule, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from '../filter-search/support/datePicker/CustomDatepickerI18n';
import { NgbDatePTParserFormatter } from '../filter-search/support/datePicker/NgbDatePTParserFormatter';
import { NumberPickerModule } from 'ng-number-picker';
import { NgxSelectModule } from 'ngx-select-ex';
import { ClickOutsideModule } from 'ng-click-outside';
import { InfoMessageModule } from '../shared/components/info/info-message.module';


@NgModule({
    declarations: [
        DetailComponent,
        RoomComponent,
        ReviewDetailComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        FilterSearchModule,
        NgxMaskModule.forRoot(),
        AlertMessageModule,
        CarouselModule,
        ModalModule.forRoot(),
        GaleryImagesModule,
        GalleryThumbModule,
        MapModule,
        NgxPageScrollModule,
        PaginationModule,
        HttpLinkModule,
        ApolloModule,
        GraphQLModule,
        NgbModule,
        NgxSelectModule,
        NumberPickerModule,
        ClickOutsideModule,
        InfoMessageModule
    ],
    exports: [
        DetailComponent
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'pt-PT'},
        DetailService,
        BsModalService,
        [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
        [{ provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter }],
    ]
})
export class DetailModule {
}
