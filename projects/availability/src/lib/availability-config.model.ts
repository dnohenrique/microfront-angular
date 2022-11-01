export interface AvailabilityConfig {
    apiAvailabilityUrl: string;
    apiUrlBff: string;
    urlRedirectBooking?: string;
    urlRedirectList: string;
    urlRedirectDetail: string;
    urlSimulatorList?: string;
    urlSimulatorDetail?: string;
    urlStaticList?: string;
    urlStaticDetail?: string;
    urlKrakenql?: string;
    isNewAba?: boolean;
}
