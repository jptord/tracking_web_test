import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServicioApi } from './servicio-api';


@Injectable({
	providedIn: 'root'
})
export class WSapiService {
	apiUrl = environment.wsapiserver;
	apiName = 'device';
	prefix = '';
	constructor(private http: HttpClient) { }

	getTracks(id: string = '') {
		console.log("url", this.apiUrl + `/${this.apiName}/${id}/tracks`);
		return this.http.get(this.apiUrl + `/${this.apiName}/${id}/tracks`);
	}
	getHistoryTracks(id: string = '') {
		console.log("url", this.apiUrl + `/${this.apiName}/${id}/tracksHistory`);
		return this.http.get(this.apiUrl + `/${this.apiName}/${id}/tracksHistory`);
	}

	getDevices() {
		return this.http.get(this.apiUrl + `/devicesAll`);
	}
	getAllDevices() {
		return this.http.get(this.apiUrl + `/devicesAll`);
	}
}