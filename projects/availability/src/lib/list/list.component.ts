import { Component, OnInit, HostListener, Output, EventEmitter, Input, Inject } from '@angular/core';
import SearchModel from '../shared/models/search.model';
import HotelModel from './models/hotel.model';
import { List } from 'linqts';
import { Common } from '../shared/support/common';
import { ListService } from './services/list.service';
import { ActivatedRoute } from '@angular/router';
import ResultDataModel from './models/result.data.model';
import { PlanService } from '../shared/services/plan.service';
import { AvailabilityConfig } from '../availability-config.model';

declare var $: any;

@Component({
  selector: 'fc-availability-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() availableDays: number;
  @Input() availablePoints: number;
  @Input() availablePointsFormat: number;
  @Input() namePlan: string;
  @Input() simulator: boolean;
  @Input() planIdDefault: string;

  @Output() errorEvent: EventEmitter<object> = new EventEmitter();
  @Output() updateProduct: EventEmitter<any> = new EventEmitter();

  constructor(
    public common: Common,
    private searchService: ListService,
    private planService: PlanService,
    @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig,
    private actRouter: ActivatedRoute) { }

  entity: SearchModel = {
    availabilityFilter: {
      rooms: [{}],
      iata: {
        locale: {
          city_id: 0
        }
      }
    }
  };
  entityResult: ResultDataModel = {
    filterAmenities: [],
    filterBoardRegimes: [],
    filterCategorys: [],
    filterHotels: [],
    filterOptionPayments: [],
    hotels: []
  };
  dataHotel: HotelModel[] = [];
  listHotel: HotelModel[] = [];
  listHotelFilter: HotelModel[] = [];
  countHotels = 2;
  selectedNameHotel: any;
  entityFilter: any = {
    selectedNameHotel: {}
  };
  viewSearch = false;
  viewOrder = false;
  viewFilter = false;
  orderId: any;
  loading = true;
  submitSearch = false;
  loadingList = false;
  isNotMyPlan = false;
  msgNotResult: boolean;
  hotelFocus = false;
  viewFilterOrder = true;
  headerInfo: any = {};
  isFilter = false;
  listOptionPayment = [];
  listOrder: any;
  viewFilterHotels = [];
  filterPlans = [];

  ngOnInit() {
    const param = this.common.getUrlSearchParams(this.actRouter);
    this.common.toScrollTop();

    if (this.simulator) {
      this.planService.getPlans().then(result => {
        param.availabilityFilter.planId = param.availabilityFilter.planId || this.planIdDefault;
        this.filterPlans = result.plans;
        if (result.checkin) {
          param.availabilityFilter.checkin = result.checkin;
        }
        this.changePlanDay(param.availabilityFilter.planId, param);
      });
    } else {
      this.resultSearch(param);
    }
  }



  changePlanDay(planId, param = null) {

    if (param) {
      this.entity = param;
    }
    const planSelected = new List<any>(this.filterPlans).First(plan => plan.id === planId);

    this.availableDays = planSelected.diarias;
    this.namePlan = planSelected.name;
    this.entity.availabilityFilter.planId = planId;
    this.entity.availabilityFilter.checkout = this.common.getDatePlusDay(this.entity.availabilityFilter.checkin, planSelected.diarias);
    this.resultSearch(this.entity);
  }

  async resultSearch(param: SearchModel = null) {
    if (this.submitSearch) {
      return;
    }

    this.submitSearch = true;
    param.availabilityFilter.planId = this.entity.availabilityFilter.planId || param.availabilityFilter.planId;
    this.entity = param;
    this.headerInfo = Object.assign({}, this.entity.availabilityFilter);

    if (this.entity !== undefined && this.entity.availabilityFilter.hotelId === 0) {
      const itemEmpty: HotelModel = {
        imageUrl: '',
        price: {
          currency: ''
        },
        street: '',
        cityName: '',
      };
      this.countHotels = 2;
      this.listHotel = [itemEmpty, itemEmpty];
      this.loading = true;
      this.loadingList = true;
      this.viewSearch = false;
      this.msgNotResult = false;
      this.isNotMyPlan = false;
      this.entityResult.filterAmenities = [];
      this.entityResult.filterBoardRegimes = [];
      this.entityResult.filterCategorys = [];
      this.entityResult.filterOptionPayments = [];
      this.entityResult.filterHotels = [];
      this.selectedNameHotel = null;

      await this.searchService.search(this.entity).then(result => {
        this.submitSearch = false;
        const resultProduct = result as ResultDataModel;
        this.countHotels = 0;
        this.listHotel = [];

        this.entityResult.instability = resultProduct.instability;

        if (resultProduct && resultProduct.hotels && resultProduct.hotels.length > 0) {
          this.entityResult = resultProduct;
          this.dataHotel = this.entityResult.hotels;
          this.countHotels = this.dataHotel.length;
          new List<HotelModel>(this.dataHotel).Where(h => h.category !== undefined).ForEach(h => {
            const cat = h.category;
            if (cat > 0) {
              h.categorys = new Array(cat);
            }
          });

          this.entityFilter.filterOptionPayments = [];
          new List<any>(this.entityResult.filterOptionPayments).ForEach(f => {
            this.entityFilter.filterOptionPayments.push(Object.assign({}, f));
          });

          this.listOptionPayment = this.entityFilter.filterOptionPayments;
          this.isFilter = new List<HotelModel>(this.dataHotel).Any(hotel => !hotel.off);
          this.listHotel = this.entityResult.hotels;
          const activeHotel = this.dataHotel.filter(r => !r.off);
          this.isNotMyPlan = new List<HotelModel>(activeHotel).All(hotel => !hotel.off && hotel.price.totalPriceExtra > 0);
          this.entity.availabilityFilter.userId = resultProduct.userId;
          this.entity.availabilityFilter.token = resultProduct.token;

          this.GetOrder();
          let count = 0;
          new List<any>(this.listOrder).ForEach(order => {
            order.selected = count === this.orderId;
            count++;
          });

          const orderId = this.defaultOrderOnlyExtra();
          this.orderHotel(orderId);
        } else {
          this.msgNotResult = !resultProduct.instability;
        }
        this.loading = false;
      }).catch(error => {
        this.submitSearch = false;
        this.errorEvent.emit({ redirect: error.networkError.status === 401 });
        this.loadingList = false;
        this.loading = false;
        this.msgNotResult = true;
        this.listHotel = [];
        this.countHotels = 0;
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const verticalOffset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;

    this.viewFilterOrder = verticalOffset < ($('.content-list').height());
  }

  ToArray(value) {
    return Array(Number(value));
  }

  validMinValue(value) {
    this.viewFilterHotels = [];
    if (value.length >= 3) {
      this.viewFilterHotels = this.entityResult.filterHotels;
    }
  }

  changeProduct(id: number) {
    this.updateProduct.emit(id);
  }

  //#region Ordenar
  GetOrder() {
    this.listOrder = new List<any>(this.common.listOrder)
      .Where(order =>
        new List<any>(this.entityResult.filterOptionPayments).Any(o => o.selected && Number(o.id) === 6)
        || (order.id !== 5 && order.id !== 6)
      ).ToArray();
  }

  defaultOrderOnlyExtra() {
    const relevancia = 0;
    const extraMenorParaMaior = 5;
    const idPaymentOptionExtra = 6;
    const listChecks = new List<any>(this.entityResult.filterOptionPayments).Where(item => item.selected);
    // if (listChecks.Count(item => item.selected) === 1 && listChecks.Any(item => Number(item.id) === idPaymentOptionExtra)) {
    //   new List<any>(this.common.listOrder).ForEach(o => o.selected = Number(o.id) === extraMenorParaMaior);
    //   this.orderId = extraMenorParaMaior;
    //   return extraMenorParaMaior;
    // }

    new List<any>(this.common.listOrder).ForEach(o => o.selected = o.id === relevancia);
    this.orderId = relevancia;
    return relevancia;
  }

  orderHotelMobile(itemSelected) {
    new List<any>(this.common.listOrder).Where(o => itemSelected.id !== o.id).ForEach(o => o.selected = false);
  }

  closeOrder() {
    this.viewOrder = false;
    this.common.showBodyScroll();
    const list = new List<any>(this.common.listOrder);
    list.ForEach(o => o.selected = false);
    list.Where(o => o.id === this.orderId).ForEach(o => o.selected = true);
  }

  orderHotel(value, scrollTop = true) {
    if (this.common.verifyIsMobile() || this.common.verifyIsTablet()) {
      this.common.showBodyScroll();
      this.viewOrder = false;
      const itemSelected = new List<any>(this.listOrder).FirstOrDefault(o => o.selected);
      if (itemSelected) {
        this.orderId = itemSelected.id;
      }
      if (scrollTop) {
        this.common.toScrollTop('.list-content');
      }
    } else {
      this.orderId = value;
    }
    const lstHotels = Object.assign([], this.listHotel);
    switch (this.orderId) {
      default:
      case 0:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenByDescending(h => h.recommended)
          .ThenBy(h => h.price.optionPaymentId)
          .ThenBy(h => h.price.totalPriceExtra)
          .ThenByDescending(h => h.relevance)
          .ToArray();
        break;
      case 1:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenBy(h => h.category).ToArray();
        break;
      case 2:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenByDescending(h => h.category).ToArray();
        break;
      case 3:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenBy(h => h.review.notaMedia).ToArray();
        break;
      case 4:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenByDescending(h => h.review.notaMedia).ToArray();
        break;
      case 5:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenByDescending(h => h.price.optionPaymentId)
          .ThenBy(h => h.price.totalPriceExtra).ToArray();
        break;
      case 6:
        this.listHotel = new List<HotelModel>(lstHotels)
          .OrderBy(h => h.off)
          .ThenByDescending(h => h.price.optionPaymentId)
          .ThenByDescending(h => h.price.totalPriceExtra).ToArray();
        break;
    }
  }

  viewMobileOrder() {
    this.common.hideBodyScroll();
    this.viewOrder = true;
  }

  //#endregion

  //#region Filtros

  closeFilter() {
    this.common.showBodyScroll();
    this.viewFilter = false;

    // Plano
    if (this.entityFilter.filterOptionPayments) {
      this.entityResult.filterOptionPayments = this.resetList(this.entityFilter.filterOptionPayments);
    }

    // Nome do Hotel
    this.selectedNameHotel = this.entityFilter.selectedNameHotel;

    // Estrelas
    if (this.entityFilter.filterCategorys) {
      this.entityResult.filterCategorys = this.resetList(this.entityFilter.filterCategorys);
    }

    // Regime de alimentação
    if (this.entityFilter.filterBoardRegimes) {
      this.entityResult.filterBoardRegimes = this.resetList(this.entityFilter.filterBoardRegimes);
    }

    // Serviços
    if (this.entityFilter.filterAmenities) {
      this.entityResult.filterAmenities = this.resetList(this.entityFilter.filterAmenities);
    }

    this.applyFilterHotel(6, false, false);
  }

  viewMobileFilter() {
    this.common.hideBodyScroll();
    this.viewFilter = true;
  }

  private resetList(listFilter) {
    const list = [];
    new List<any>(listFilter).ForEach(f => {
      list.push(Object.assign({}, f));
    });

    return list;
  }

  filterMobile(cancelView = true) {
    this.common.toScrollTop('.list-content');
    if (cancelView) {
      this.viewFilter = false;
    }

    // Plano
    this.entityFilter.filterOptionPayments = this.addList(this.entityResult.filterOptionPayments);

    // Nome Hotel
    this.entityFilter.selectedNameHotel = this.selectedNameHotel;

    // Estrelas
    this.entityFilter.filterCategorys = this.addList(this.entityResult.filterCategorys);

    // Regime de alimentação
    this.entityFilter.filterBoardRegimes = this.addList(this.entityResult.filterBoardRegimes);

    // Serviços
    this.entityFilter.filterAmenities = this.addList(this.entityResult.filterAmenities);

    this.applyFilterHotel(6);
  }

  private addList(list) {
    const listFilter = [];
    new List<any>(list).ForEach(f => {
      listFilter.push(Object.assign({}, f));
    });

    return listFilter;
  }

  selectedPlan(event) {
    if (new List<any>(this.entityResult.filterOptionPayments).All(item => !item.selected)) {
      new List<any>(this.entityResult.filterOptionPayments).FirstOrDefault().selected = true;
      if (event.target.id === 'checkPlano0') {
        event.target.checked = true;
      }
    }
    this.defaultOrderOnlyExtra();

    if (!this.common.verifyIsMobile() && !this.common.verifyIsTablet()) {
      this.selectedNameHotel = null;
      this.entityResult.filterCategorys = this.clearSelectedFilter(this.entityFilter.filterCategorys);
      this.entityResult.filterBoardRegimes = this.clearSelectedFilter(this.entityFilter.filterBoardRegimes);
      this.entityResult.filterAmenities = this.clearSelectedFilter(this.entityFilter.filterAmenities);
    }

    this.filterHotels();
  }

  filterHotels(position = 1, itemSelected = null) {
    if ((this.common.verifyIsMobile() || this.common.verifyIsTablet())) {
      this.applyFilterHotel(position, true);
    } else {
      switch (position) {
        // Planos
        case 1:
          this.entityFilter.filterOptionPayments = this.entityResult.filterOptionPayments;
          break;
        // Nome do Hotel
        case 2:
          this.entityFilter.selectedNameHotel = itemSelected;
          break;
        // Estrelas
        case 4:
          this.entityFilter.filterCategorys = this.entityResult.filterCategorys;
          break;
        // Regime de alimentação
        case 5:
          this.entityFilter.filterBoardRegimes = this.entityResult.filterBoardRegimes;
          break;
        // Serviços
        case 6:
          this.entityFilter.filterAmenities = this.entityResult.filterAmenities;
          break;
      }

      this.applyFilterHotel(position);
    }
  }

  setReviewHotels(result) {
    const listResult = new List<any>(result);
    new List<any>(this.dataHotel)
      .Where(hotel => listResult.Any(r => r.id === hotel.id))
      .ForEach(hotel => {
        hotel.review = listResult.FirstOrDefault(r => hotel.id === r.id);
      });
  }

  // Efetiva o filtro selecionado
  applyFilterHotel(position = 1, onlyFilter = false, scrollTop = true) {
    this.loadingList = true;
    let hotels = Object.assign([], this.dataHotel);
    hotels = this.changeNameHotel(hotels, onlyFilter);
    if (hotels.length > 1) {
      hotels = this.changePlans(hotels, onlyFilter);
      hotels = this.changeCategory(hotels, onlyFilter);
      hotels = this.changeRegime(hotels, onlyFilter);
      hotels = this.changeAmenidades(hotels, onlyFilter);
    }

    this.listHotelFilter = [];
    if (onlyFilter) {
      this.listHotelFilter = new List<HotelModel>(hotels).Select(h => Object.assign({}, h)).ToArray();

      if (scrollTop) {
        this.common.showBodyScroll();
        this.common.toScrollTop('.list-content');
      }
    } else {
      this.listHotel = new List<HotelModel>(hotels).Select(h => Object.assign({}, h)).ToArray();
    }

    this.countHotels = this.listHotel.length;
    this.GetOrder();
    this.orderHotel(this.orderId, scrollTop);
    this.msgNotResult = this.countHotels === 0;
    this.LoadFilters(position, onlyFilter);
  }

  private LoadFilters(position, onlyFilter) {
    let list = new List<any>(this.listHotel);
    let filters = this.entityFilter;

    if (onlyFilter) {
      list = new List<any>(this.listHotelFilter);
      filters = this.entityResult;
    }

    if (position !== 1) {
      // Exibir por plano
      let index = 0;
      const filterOptionPayments = new List<any>(this.listOptionPayment).Select(optionSelected => {
        const selected = list.Any(hotel => optionSelected.id === hotel.price.optionPaymentId);
        const firstVerify = new List<any>(filters.filterOptionPayments).Any(p => p.id === optionSelected.id && selected);
        index++;
        return {
          id: optionSelected.id,
          name: optionSelected.name,
          selected: firstVerify || (!firstVerify && index === 1)
        };
      }).OrderBy(hotel => hotel.id).ToArray();

      this.entityResult.filterOptionPayments = filterOptionPayments;
    }
    if (position !== 2 || new List<any>(filters.filterHotels).All(p => !p.selected)) {
      // Nome do Hotel
      const filterNameHotels = list.Select(hotel => {
        return {
          id: hotel.id,
          description: hotel.name,
          selected: new List<any>(filters.filterHotels).Any(p => p.id === hotel.id && p.selected)
        };
      }).DistinctBy(hotel => hotel.id)
        .OrderBy(hotel => hotel.description).ToArray();

      this.entityResult.filterHotels = filterNameHotels;
    }
    if (position !== 4 || new List<any>(filters.filterCategorys).All(p => !p.selected)) {
      //  Categoria
      const filterCategorys = list.Where(hotel => hotel.category)
        .Select(hotel => {
          return {
            description: hotel.category,
            selected: new List<any>(filters.filterCategorys).Any(p => p.description === hotel.category && p.selected)
          };
        }).DistinctBy(hotel => hotel.description)
        .OrderByDescending(hotel => hotel.description).ToArray();

      this.entityResult.filterCategorys = filterCategorys;
    }
    if (position !== 5 || new List<any>(filters.filterBoardRegimes).All(p => !p.selected)) {

      // Refeições
      const filterBoardRegimes = list.SelectMany(hotel => {
        return new List<any>(hotel.regimes).Select(regime => {
          return {
            description: regime,
            selected: new List<any>(filters.filterBoardRegimes).Any(p => p.description === regime && p.selected)
          };
        });
      })
        .Where(regime => regime.description)
        .DistinctBy(regime => regime.description)
        .OrderBy(regime => regime.description).ToArray();

      this.entityResult.filterBoardRegimes = filterBoardRegimes;
    }
    if (position !== 6 || new List<any>(filters.filterAmenities).All(p => !p.selected)) {
      // Serviços
      const filterAmenities = list.SelectMany(hotel => {
        return new List<any>(hotel.amenities).Select(amenities => {
          return {
            description: amenities,
            selected: new List<any>(filters.filterAmenities).Any(p => p.description === amenities && p.selected)
          };
        });
      }).DistinctBy(hotel => hotel.description)
        .OrderBy(hotel => hotel.description).ToArray();

      this.entityResult.filterAmenities = filterAmenities;
    }
  }

  private clearSelectedFilter(list) {
    return new List<any>(list).Select(item => item.selected = false);
  }

  private changePlans(hotels: HotelModel[], onlyFilter = false) {
    const filter = onlyFilter ? this.entityResult.filterOptionPayments : this.entityFilter.filterOptionPayments;
    return new List<HotelModel>(hotels).Where(h =>
      new List<any>(filter).Any(c => c.selected && Number(c.id) === h.price.optionPaymentId) || h.off).ToArray();
  }

  private changeNameHotel(hotels: HotelModel[], onlyFilter = false) {
    const hotelId = Number(onlyFilter ? this.selectedNameHotel : this.entityFilter.selectedNameHotel);

    if (hotelId) {
      const result = new List<HotelModel>(hotels).Where(h => h.id === hotelId).ToArray();
      return result;
    } else { return hotels; }
  }

  private changeCategory(hotels: HotelModel[], onlyFilter = false) {
    const filters = onlyFilter ? this.entityResult.filterCategorys : this.entityFilter.filterCategorys;

    if (new List<any>(filters).Any(c => c.selected)) {
      return new List<HotelModel>(hotels).Where(h =>
        new List<any>(filters)
          .Any(c => c.selected && Number(c.description) === Number(h.category))).ToArray();
    } else { return hotels; }
  }

  private changeRegime(hotels: HotelModel[], onlyFilter = false) {
    const filters = onlyFilter ? this.entityResult.filterBoardRegimes : this.entityFilter.filterBoardRegimes;

    if (new List<any>(filters).Any(c => c.selected)) {
      return new List<HotelModel>(hotels).Where(h =>
        new List<any>(filters)
          .Any(c => c.selected && new List<any>(h.regimes).Any(regime => regime === c.description))).ToArray();
    } else { return hotels; }
  }

  private changeAmenidades(hotels: HotelModel[], onlyFilter = false) {
    const filters = onlyFilter ? this.entityResult.filterAmenities : this.entityFilter.filterAmenities;

    if (new List<any>(filters).Any(c => c.selected)) {
      return new List<HotelModel>(hotels).Where(h => {
        let result = true;
        new List<any>(filters).Where(c => c.selected).ForEach(c => {
          result = result && new List<any>(h.amenities).Any(amenitie => amenitie === c.description);
        });
        return result;
      }).ToArray();
    } else { return hotels; }
  }

  clearFilters() {
    this.selectedNameHotel = null;
    this.entityFilter.selectedNameHotel = null;
    this.entityResult.filterCategorys = this.clearSelectedFilter(this.entityFilter.filterCategorys);
    this.entityResult.filterBoardRegimes = this.clearSelectedFilter(this.entityFilter.filterBoardRegimes);
    this.entityResult.filterAmenities = this.clearSelectedFilter(this.entityFilter.filterAmenities);
    this.closeFilter();
  }
  //#endregion
}
