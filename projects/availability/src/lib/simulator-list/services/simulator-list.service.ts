import { HttpClientService } from '../../shared/services/http-client.service';
import { Injectable, Inject } from '@angular/core';

import { AvailabilityConfig } from '../../availability-config.model';
import HotelSimulatorModel from '../models/hotel-simulator.model';



@Injectable()
export class SimulatorListService {

    constructor(
        private http: HttpClientService,
        @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
    ) { }

    async search(searchRequest: HotelSimulatorModel) {

        return await this.http.post(this.availabilityConfig.apiAvailabilityUrl + 'hotel/', 'HotelSimulador/GetHotelsByCity', searchRequest);
    }
}
