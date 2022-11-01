import { NgModule, Inject } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AvailabilityConfig } from '../../availability-config.model';


let uri = '';
export function createApollo(httpLink: HttpLink) {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
    defaultOptions
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
  constructor(@Inject('availabilityConfig') availabilityConfig: AvailabilityConfig) {
    uri = availabilityConfig.apiUrlBff + '/api-disponibilidade/schema';
  }
}
