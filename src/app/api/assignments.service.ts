import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServicioApi } from './servicio-api';


@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
	apiUrl = environment.apiserver;
	apiName = 'Assignments';
	prefix = '';
	constructor(private http: HttpClient) {}
  
	setPrefix(prefix: string) {
	  this.prefix = prefix;
	}
  
	register(datos: any) {
	  return this.http.post(
		this.apiUrl + this.prefix + `/${this.apiName}`,
		datos
	  );
	}
  
	update(datos: any, id: any): Observable<any> {
	  return this.http.put(
		this.apiUrl + this.prefix + `/${this.apiName}/${id}`,
		datos
	  );
	}
  
	findByPersonal(personalId: string = '') {
		return this.http.get(this.apiUrl + `assignments/bypersonal?personal_id=${personalId}`);
	  }
	
	find(id: string = '') {
		return this.http.get(this.apiUrl + this.prefix + `/${this.apiName}/${id}`);
	  }
  
	getAll(
	  size: number = 100,
	  page: number = 1,
	  sortBy: string = 'id',
	  descending: false,
	  keyword: any = ''
	) {
	  return this.http.get(
		this.apiUrl +
		  this.prefix +
		  `/${this.apiName}?size=${size}&page=${
			page - 1
		  }&sortBy=${sortBy}&descending=${descending}&keyword=${keyword}`
	  );
	}
  
	delete(id: string | number): Observable<any> {
	  return this.http.delete(
		this.apiUrl + this.prefix + `/${this.apiName}/${id}`
	  );
	}
  
	habilitar(datos: any, id: string | number): Observable<any> {
	  datos['Listado de Personal'] = 'habilitar';
	  return this.http.put(
		this.apiUrl + this.prefix + `/${this.apiName}/${datos.id}`,
		datos
	  );
	}
  
	deshabilitar(datos: any, id: string | number): Observable<any> {
	  datos['Listado de Personal'] = 'deshabilitar';
	  return this.http.put(
		this.apiUrl + this.prefix + `/${this.apiName}/${datos.id}`,
		datos
	  );
	}
  }
  