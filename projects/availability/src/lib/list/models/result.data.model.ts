import HotelModel from './hotel.model';

export default class ResultDataModel {
    hotels: HotelModel[];
    filterAmenities: any;
    filterBoardRegimes: any;
    filterCategorys: any;
    filterOptionPayments: any;
    filterHotels: any;
    availableDays?: number;
    namePlan?: string;
    instability?: boolean;
    token?: string;
    userId?: string;
}
