import { Component, EventEmitter, Output } from '@angular/core';
import { RoutesService } from '../../api/routes.service';
import { PointsService } from '../../api/points.service';

@Component({
  selector: 'app-modal-import',
  templateUrl: './modal-import.component.html',
  styleUrl: './modal-import.component.css'
})

export class ModalImportComponent {
	@Output() onClose = new EventEmitter<string>();
	
	constructor(
		private routesService: RoutesService,
		private pointsService: PointsService,){};

	importData:any = {
		text : "",
		json: "",
		routes : []
	} 

	closeModal(){
		this.onClose.emit();
	}
	readFile(event:any,importData:any){
		const file = event.target.files[0];
		const reader = new FileReader();
		//reader.readAsDataURL(file);
		reader.onload = () => {
			//console.log(reader.result.toString());
			importData.text = reader.result.toString();
			importData.json = JSON.parse(importData.text);			

			console.log("importData.json",importData.json);
			this.registerComplete = 0;
			importData.json.features.forEach( (feature:any)=>{
				var rxColor = new RegExp("(?<=\<tr bgcolor\=\"\#)[A-F0-9]{6}","i");
				var rxDistance = new RegExp("(?<=\<td\>LONG\<\/td>)[0-9\,\<\>td\n]*","i");
				var points = [];
				feature.geometry.coordinates.forEach( (c:any, index:number) => {
					c.forEach(p =>{
						points.push( [p[0],p[1],index] );
						this.registerComplete ++;
					})
					
				});
				var route = {
					nombre : feature.properties.Name,
					color : feature.properties.description.match(rxColor)[0],
					distancia : parseFloat(feature.properties.description.match(rxDistance)[0].replaceAll("<td>","").replaceAll("<","").replaceAll(",",".").replaceAll(" ","").replaceAll("\n",""))*1000,
					points : points,
					thumb:"",
					id: '',
					min_split_mt: '5',
					max_split_mt: '10',					
				};
				importData.routes.push(route);
			} );
			console.log("importData",importData);
			
		};
    	reader.readAsText(file);
	}
	saveOnDb(){
		this.registerCount = 0;
		this.saveRoute(this.importData.routes,0);
	}
	saveRoute(routes:[],index:number) {
		
		this.routesService.register(routes[index]).subscribe((result: any) => {
			console.log("result", result);

			if ( result.content instanceof Array)
				this.savePoints(result.content[0],()=>{ if (index < routes.length) this.saveRoute(routes,index+1);	});
			else
				this.savePoints(result.content,()=>{ if (index < routes.length) this.saveRoute(routes,index+1); });
			
		});
	}
	registerCount = 0;
	registerComplete = 0;
	createProgress = 'Guardar';

	savePoints(contentRoute: any,callback) {
		this.regPoint(0,contentRoute,callback);
	}
	regPoint(index,contentRoute:any,callback){
		if (contentRoute.points.length == index ){ 
			this.createProgress = "Completado";
			callback();
			return;
		}
		this.registerCount++;
		this.createProgress = "Guardando " + Math.round((this.registerCount/this.registerComplete)*100) + "%";
		//console.log(this.createProgress);
		let coord = contentRoute.points[index];
		let punto = {
			route_id: contentRoute.id,
			lat: coord[1],
			lon: coord[0],
			section: coord[2],
		}
		this.pointsService.register(punto).subscribe((result: any) => {
			console.log("punto creado result:", result)
			this.regPoint(index+1,contentRoute,callback);			
		});
	}
}
