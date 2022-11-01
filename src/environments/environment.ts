// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlBFF: 'http://localhost:32608',
  // urlBFF: 'https://services-hml.ferias.co:8443',
  urlApi: 'http://localhost:32603',
  urlApiAvaliability: 'http://localhost:32315/v1/',
  // urlApi: 'https://services-hml.ferias.co:8443/v1/',
  urlBooking: 'http://localhost:4100/#/reservation/',
  fcStyles: 'http://css-styleguide-staging.platform.ferias.in/styles/main.css',
  // urlBooking: 'http://shared-all-libraries.s3-website-us-east-1.amazonaws.com/booking/dev/#/reservation/'
  // urlKrakenQl: 'http://localhost:3000',
  urlKrakenQl: 'https://services-hml.ferias.co:8443',
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
