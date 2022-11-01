import { Injectable, Inject } from '@angular/core';
import { AvailabilityConfig } from './availability-config.model';


@Injectable()
export class AvailabilityConfigService {

    private userId = '';
    constructor(@Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig) {
    }


}
