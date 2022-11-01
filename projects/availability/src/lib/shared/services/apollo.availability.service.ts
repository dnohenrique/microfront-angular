import { Injectable, Inject } from '@angular/core';

import { HttpLink } from 'apollo-angular-link-http';
import { Apollo } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';
import { DefaultOptions } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AvailabilityConfig } from '../../availability-config.model';

type endpoints = '/api-disponibilidade/public' |  '/api-disponibilidade/schema' | '/krakenql/schema';
const clients = [
    {
        name: '',
        endpoint: '/api-disponibilidade/schema',
        requireAuthorization: true
    },
    {
        name: 'api-disponibilidade',
        endpoint: '/api-disponibilidade/schema',
        requireAuthorization: true
    },
    {
        name: 'krakenql',
        endpoint: '/krakenql/schema',
        requireAuthorization: true
    },
    {
        name: 'api-disponibilidade-public',
        endpoint: '/api-disponibilidade/public',
        requireAuthorization: false
    }
];

@Injectable({
    providedIn: 'root'
})
export class ApolloAvailabilityService {

    private availabilityConfig: AvailabilityConfig;

    constructor(
        private apollo: Apollo,
        private httpLink: HttpLink,
        @Inject('availabilityConfig') config: AvailabilityConfig,
    ) {
        this.availabilityConfig = config;
    }

    createClient(endpoint: endpoints) {
        const client = clients.find(x => x.endpoint === endpoint);
        this.removeApolloClient(client.name);

        const defaultOptions: DefaultOptions = {
            watchQuery: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all',
            },
        };
        const headers = this.createHeaders(client.requireAuthorization);

        let url = this.availabilityConfig.apiUrlBff;

        if (endpoint.indexOf('kraken') > -1) {
            url = this.availabilityConfig.urlKrakenql;
        }

        const apolloParams = {
            cache: new InMemoryCache(),
            link: this.httpLink.create({ uri: url + endpoint, headers }),
            defaultOptions
        };

        try {
            if (!client.name) {
                this.apollo.createDefault(apolloParams);
            } else {
                this.apollo.create(apolloParams, client.name);
            }
            return client.name ? this.apollo.use(client.name) : this.apollo.default();
        } catch (error) {
            console.error('Booking - Falha ao criar Apollo Client', error);
            throw error;
        }
    }

    removeApolloClient(name: string = '') {
        if (!name && this.apollo.default()) {
            this.apollo.removeClient();
        }
        if (this.apollo.use(name)) {
            this.apollo.removeClient(name);
        }
    }

    private createHeaders(includeAuthorization): HttpHeaders {
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('companyToken');
        if (includeAuthorization && accessToken) {
            return new HttpHeaders().append('Authorization', `Bearer ${accessToken}`);
        }

        return null;
    }
}
