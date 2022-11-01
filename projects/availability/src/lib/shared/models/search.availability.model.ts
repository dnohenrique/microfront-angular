import SearchRoomModel from './search.room.model';
import SearchIataModel from './search.iata.model';

export default class AvailabilityModel {
    checkinDate?: Date;
    checkoutDate?: Date;
    checkin?: string;
    checkout?: string;
    numberOfNights?: number;
    hotelName?: string;
    rooms: SearchRoomModel[];
    iata: SearchIataModel;
    userId?: string;
    token?: string;
    showModalSessionExpired?: number;
    cnpj?: string;
    planId?: string;

    // não utilizado api
    destinationText?: string;
    destinationValue?: number;
    qtdHospede?: number;
    qtdRooms?: number;
    qtdChild?: number;
    qtdAdult?: number;
    hotelId?: number;
    brokerId?: number;

    isRecommend?: boolean;
}




