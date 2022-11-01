import { HttpClientService } from '../../shared/services/http-client.service';
import { Injectable, Inject } from '@angular/core';
import { Common } from '../../shared/support/common';
import { AvailabilityConfig } from '../../availability-config.model';

@Injectable()
export class SimulatorDetailService {

    constructor(
        private http: HttpClientService,
        @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
    ) { }

    async getDetail(hotelId: number) {

        return await this.http.post(this.availabilityConfig.apiAvailabilityUrl + 'hotel/', 'HotelSimulador/GetHotelsByHotel',
            { hotelSimulatorFilter: { hotelId } });
    }
}
