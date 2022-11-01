import { HttpClientService } from '../../shared/services/http-client.service';
import { Injectable, Inject } from '@angular/core';
import { AvailabilityConfig } from '../../availability-config.model';

@Injectable()
export class SimulatorFilterService {

    constructor(
        private http: HttpClientService,
        @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig) { }

    async getAutoComplete(textSearch: string) {
        const listText = textSearch.split(',');
        let txt = listText[0].replace(/,/g, '').replace(/-/g, '');
        if (txt.length > 15) {
            txt = txt.substring(0, 15);
        }

        return await this.http.get(this.availabilityConfig.apiAvailabilityUrl + 'AutoComplete/GetAutoComplete/', txt + '/2');
    }
}
