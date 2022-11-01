import { HttpClientService } from '../../shared/services/http-client.service';
import { Injectable, Inject } from '@angular/core';
import SearchModel from '../../shared/models/search.model';
import { List } from 'linqts';
import SearchRoomModel from '../../shared/models/search.room.model';
import { AvailabilityConfig } from '../../availability-config.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ListService {
  private availabilityConfig: AvailabilityConfig;

  constructor(
    private http: HttpClientService,
    @Inject('availabilityConfig') config: AvailabilityConfig
  ) {
    this.availabilityConfig = config;
  }

  async search(searchRequest: SearchModel) {
    try {
      const filterRequest = Object.assign({}, searchRequest);

      const rooms = new List<SearchRoomModel>(filterRequest.availabilityFilter.rooms).Select(room => {
        const roomResult = {
          quantityAdults: room.quantityAdults,
          quantityChild: room.quantityChild,
          childAges: new List<any>(room.childAgesCustom).Select(child => child.age === 0 ? 1 : child.age).ToArray()
        };

        return roomResult;
      }).ToArray();

      const filter = {
        availabilityFilter: {
          checkin: filterRequest.availabilityFilter.checkinDate,
          checkout: filterRequest.availabilityFilter.checkoutDate,
          destinationId: filterRequest.availabilityFilter.destinationValue,
          userId: filterRequest.availabilityFilter.userId,
          rooms,
          cnpj: sessionStorage.getItem('acc'),
          planId: filterRequest.availabilityFilter.planId,
          token: filterRequest.availabilityFilter.token
        }
      };

      const response = await this.http.post(this.availabilityConfig.apiUrlBff, '/api-disponibilidade/1', filter);
      if (response.status === 400) {
        return {
          instability: true
        };
      }

      return response;

    } catch (error) {
      return {
        instability: true
      };
    }
  }
}
