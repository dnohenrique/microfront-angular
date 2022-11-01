
import { Injectable } from '@angular/core';
import { ApolloAvailabilityService } from './apollo.availability.service';
import gql from 'graphql-tag';
import { List } from 'linqts';
import { Common } from '../support/common';

@Injectable()
export class PlanService {
  private apollo;
  constructor(
    private apolloAvailabilityService: ApolloAvailabilityService,
    private commom: Common
  ) {
  }

  async getPlans() {
    try {
      this.apollo = this.apolloAvailabilityService.createClient('/krakenql/schema');
      const response: any = await this.apollo.query({
        query: gql`query($cnpj: String!, $cpf: String!){
          plansByCompanySimulator(cnpj: $cnpj, cpf: $cpf) {
            checkin
            planos{
              tipoPlano
              subplanos {
                id
                diarias
              }
            }
          }
        }`,
        variables: {
          cnpj: sessionStorage.getItem('acc'),
          cpf: ''
        }
      }
      ).toPromise();

      const plans = new List<any>(response.data.plansByCompanySimulator.planos)
        .Select(plan => {
          const subplans = plan.subplanos.map(p => {
            return {
              id: p.id,
              diarias: p.diarias,
            };
          });
          return {
            name: plan.tipoPlano,
            id: subplans[0].id,
            diarias: subplans.find(p => p.diarias >= 4).diarias,
            subplans
          };
        }).ToArray();

      return { 
        plans,  
        checkin:  this.commom.getDateString(response.data.plansByCompanySimulator.checkin)
      }
    } catch (error) {
      throw error;
    }
  }
}
