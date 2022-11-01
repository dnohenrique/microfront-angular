import ImagesModel from './images.model';
import HotelAddressModel from './address.model';
import HotelAmenitiesModel from './amenities.model';
import RoomsModel from '../../shared/models/room.model';
import PriceModel from '../../shared/models/price.model';
import ReviewModel from './review.model';

export default class HotelModel {
    acommodationType?: string;
    address?: HotelAddressModel[];
    street?: string;
    cityName?: string;
    regimes?: [];
    amenities?: HotelAmenitiesModel[];
    description?: string;
    broker?: number;
    category?: number;
    categorys?: any;
    chain?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    days?: number;
    id?: number;
    latitude?: number;
    longitude?: number;
    name?: string;
    imageUrl?: string;
    secondImage?: string;
    thirdImage?: string;
    images?: ImagesModel[];
    recommended?: boolean;
    rooms?: RoomsModel[];
    price?: PriceModel;
    off?: boolean;
    review?: ReviewModel;
    isNonRefundable?: boolean;
    relevance?: number;
}
