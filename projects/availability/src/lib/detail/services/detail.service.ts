import { HttpClientService } from '../../shared/services/http-client.service';
import { Injectable, Inject } from '@angular/core';
import { AvailabilityConfig } from '../../availability-config.model';
import SearchRoomModel from '../../shared/models/search.room.model';
import { List } from 'linqts';
import { ApolloAvailabilityService } from '../../shared/services/apollo.availability.service';
import gql from 'graphql-tag';

@Injectable()
export class DetailService {
    private apollo;

    constructor(
        private http: HttpClientService,
        private apolloAvailabilityService: ApolloAvailabilityService,
        @Inject('availabilityConfig') private availabilityConfig: AvailabilityConfig
    ) {
    }

    async getDetail(detailRequest: any) {
        return await this.http.post(this.availabilityConfig.apiAvailabilityUrl + 'hotel/', 'Details/GetDetails',
            { hotelDetailsFilter: detailRequest });
    }

    async getDetailRoom(availabilityFilter) {
        try {
            const detailRequest = Object.assign({}, availabilityFilter);

            const rooms = new List<SearchRoomModel>(detailRequest.rooms).Select(room => {
                const roomResult = {
                    quantityAdults: room.quantityAdults,
                    quantityChild: room.quantityChild,
                    childAges: new List<any>(room.childAgesCustom).Select(child => child.age === 0 ? 1 : child.age).ToArray()
                };

                return roomResult;
            }).ToArray();

            detailRequest.rooms = rooms;
            detailRequest.hotelId = Number(detailRequest.hotelId);
            detailRequest.cnpj = sessionStorage.getItem('acc');

            const response = await this.http
                .post(this.availabilityConfig.apiUrlBff, '/api-disponibilidade/rooms', { availabilityFilter: detailRequest },
            );
            if (response.status === 400) {
                return {
                    instability: true
                };
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getReviewDetail(hotelId) {
        try {
            this.apollo = this.apolloAvailabilityService.createClient('/api-disponibilidade/schema');
            const response: any = await this.apollo.query({
                query: gql`query($hotelId: Int!) {
                    getReviewsByParameters(filter:{
                        ServicoId: $hotelId
                    }) {
                        total
                        reviews{
                            nomeAutor
                            urlFotoAutor
                            notaGeral
                            descricaoExperiencia
                            dataCriacao
                            notaMediaExibicao
                            dataPublicacao
                        }
                    }
                  }`,
                variables: {
                    hotelId
                }
            }
            ).toPromise();

            return response.data.getReviewsByParameters;
        } catch (error) {
            throw error;
        }
    }

    async searchPayment(searchRequest: any) {
        try {
    
          const input = {
            airId: searchRequest.airId,
            userId: sessionStorage.getItem('xdc'),
            token: searchRequest.token,
            planDailyUsed: searchRequest.planDailyUsed,
            planPointUsed: searchRequest.planPointUsed,
            product: {
              id: 1,
              type: 1,
              totalPrice: searchRequest.totalPrice,
              currency: 'BRL'
            }
          };
    
          this.apollo = this.apolloAvailabilityService.createClient('/api-disponibilidade/schema');
          const response: any = await this.apollo.query({
            query: gql`query($input: paymentOptionInput) {
                        getPaymentMultOption(input: $input)
                          {
                            calculationProducts{
                              optionPaymentId
                              totalPriceExtra
                              planExtraPrice
                              planPointUsed
                              planPointUsedFormat
                              planDailyUsed
                              accumulatedPoint
                              accumulatedPointFormat
                              currency
                            }
                           paymentOptions{
                            id
                            name
                            selected
                          }
                        }
                      }`,
            variables: { input }
          }
          ).toPromise();
    
          return response.data.getPaymentMultOption;
    
        } catch (error) {
          throw error;
        }
      }
}
