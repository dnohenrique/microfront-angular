import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HttpClientService {

    constructor(
        private http: HttpClient
    ) {
    }

    private prepareHeaders(customHeaders?: HttpHeaders): HttpHeaders {
        const token = localStorage.getItem('access_token') || '';
        let myHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            timeout: `${120000}`
        });

        if (customHeaders) {
            myHeaders = customHeaders;
        }
        return myHeaders;
    }

    async get(apiUrl: string, endpoint: string, customHeaders?: HttpHeaders): Promise<any> {

        const headers = this.prepareHeaders(customHeaders);

        const request = await this.http.get(apiUrl + endpoint, { headers }).toPromise()
            .then(response => {
                return response;
            })
            .catch(error => {
                this.handleResponseError(error);
                return null;
            });
        return request;
    }

    async post(apiUrl: string, endpoint: string, body: any, customHeaders?: HttpHeaders) {

        const headers = this.prepareHeaders(customHeaders);

        const request = await this.http.post(apiUrl + endpoint, body, { headers }).toPromise()
            .then(response => {
                return response;
            })
            .catch(error => {
                this.handleResponseError(error);
                return null;
            });
        return request;
    }

    put() {
    }

    delete() {
    }

    handleResponseError(error) {
        switch (error.status) {
            case '401':
                break;
            default:
                break;
        }

        throw error;
    }

}
