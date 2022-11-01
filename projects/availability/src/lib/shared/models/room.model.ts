import RoomTypeModel from './room.type.model';
import RoomPriceModel from './room.price.model';

export default class RoomsModel {
    mediaRoomId?: string;
    quantityAdults?: number;
    quantityChild?: number;
    roomsType?: RoomTypeModel[];
    roomPrices?: RoomPriceModel;
}
