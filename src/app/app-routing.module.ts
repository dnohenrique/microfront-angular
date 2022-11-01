import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { HotsiteFilterComponent } from './hotsite-filter/hotsite-filter.component';
import { HotsiteListComponent } from './hotsite-list/hotsite-list.component';
import { HotsiteDetailComponent } from './hotsite-detail/hotsite-detail.component';
import { StaticFilterComponent } from './static-filter/static-filter.component';
import { StaticDetailComponent } from './static-detail/static-detail.component';
import { StaticListComponent } from './static-list/static-list.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home/:parameter', component: HomeComponent },
  { path: 'list/:parameter/:productId', component: ListComponent },
  { path: 'detail/:parameter/:id/:productId', component: DetailComponent },
  { path: 'hotsite/home', component: HotsiteFilterComponent },
  { path: 'hotsite/home/:parameter/:productId', component: HotsiteFilterComponent },
  { path: 'hotsite/list/:parameter/:productId', component: HotsiteListComponent },
  { path: 'hotsite/detail/:parameter/:id/:productId', component: HotsiteDetailComponent },
  { path: 'static/home', component: StaticFilterComponent },
  { path: 'static/list/:parameter', component: StaticListComponent },
  { path: 'static/detail/:parameter/:id', component: StaticDetailComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      onSameUrlNavigation: 'reload'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
