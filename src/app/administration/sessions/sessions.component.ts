import { Component, OnInit, TemplateRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalService } from '../../api/personal.service';
import { RoutesService } from '../../api/routes.service';
import { AssignmentsService } from '../../api/assignments.service';
import { QrCodeModule } from 'ng-qrcode';
import { ImagesService } from '../../api/images.service';
import { environment } from '../../../environments/environment';
import { ScheduleService } from '../../api/schedule.service';
import { PersonaltypeService } from '../../api/jobroutes.services';
import { SessionsService } from '../../api/sessions.service';
import { WSapiService } from '../../api/wsapi.service';
@Component({
  selector: 'app-sessions',
  standalone: true,
  providers: [BsModalService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,QrCodeModule],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
//TREBOL-15 Para verificación servicio de control de sesiones
export class SessionsComponent implements OnInit {
	modalRef?: BsModalRef;
	constructor(
		private personalApi: PersonalService,
		private sessionsService: SessionsService,
		private personaltypeService: PersonaltypeService,
		private AssignmentsService: AssignmentsService,
		private AssignmentsPersonalService: AssignmentsService,
		private routesService: RoutesService, 
		private modalService: BsModalService,
		private imagesService: ImagesService,
		private scheduleService: ScheduleService,
		private wsapiService: WSapiService,
	) { }
	serverApi = environment.apiserver;
	personal = {
		id: '',
		name: '',
		code: '',
		image_id: '',
		image: null,
		personal_type_id: '',		
		schedule_id:1,
	};
	Schedules = [];
	Assignments = [];

	keyword="";
	countDevices = 0;

	personals: any[];
	personalType: any[];
	personalFiltred: any[];
	sessions: any[];
	sessionsFiltred

	ngOnInit(): void {		
		this.load();
	}
	filtrar(){
		if (this.keyword == "") {this.personalFiltred = this.personals; return;}
		if (this.keyword.length < 3) return;
		this.personalFiltred = this.personals.filter( (p:any)=>{
			return p.name.toLowerCase().includes(this.keyword.toLowerCase());
		});
	}
	keys(obj){
		return Object.keys(obj);
	}
	load(){
		this.personalApi.getAll2().subscribe((res: any) => {
			this.personals = res.content;
			this.personalFiltred = this.personals;
			//this.taskerImage(this.personals,0);
			
			console.log("this.personals",this.personals);
		});
		this.personaltypeService.getAll().subscribe((res:any)=>{
			this.personalType = res.content;
			console.log("this.personalType",this.personalType);
		});
		this.scheduleService.getAll().subscribe((res:any)=>{
			this.Schedules = res.content;
			console.log("this.Schedules",this.Schedules);
		});
		this.sessionsService.historyPersonal('d77cda3d-8d32-4b0c-ae7d-cf7aa1bc111a').subscribe((res:any)=>{
			this.sessions = res.content;
			this.sessionsFiltred = this.sessions;
			console.log("this.sessions",this.sessions);
			this.wsapiService.getDevices().subscribe((devicesResult:any)=>{
				console.log("this.wsapiService",devicesResult);
				devicesResult.devices.forEach((device:any) => {
					let session = this.sessions.find(s=>s.id==device.states['ID_SESSION']);
					if (session!=undefined){
						session['devicews'] = device;
						this.countDevices++;
					}
				});
				
			});
		});
	}
}