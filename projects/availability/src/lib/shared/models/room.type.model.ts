import RoomPriceModel from './room.price.model';

export default class RoomTypeModel {
    breakfeastIncluded?: boolean;
    cancelationPolicies?: any;
    days?: number;
    isBestPrice?: boolean;
    description?: string;
    isNonRefundable?: boolean;
    providerName?: string;
    maxOccupation?: number;
    providerId?: number;
    recommendedRoom?: boolean;
    regime?: any;
    roomID?: string;
    roomName?: string;
    roomPrices?: RoomPriceModel;
    roomsAvailables?: number;
    taxesIncluded?: boolean;
    quantityAdults?: number;
    quantityChild?: number;
    quantity?: number;
}
