import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MensajeDto} from '../../../../models/common/mensajeDto.dto';
import {BodegaDto} from '../../../../models/common/bodega.dto';
import {PersonalBodegaDto} from '../../../../models/personalBodega/profile/personalBodega.dto';


@Injectable({
  providedIn: 'root',
})
export class RecursosHumanosPersonalBodegaService {
  private apiUrl = 'http://192.168.1.12:8080/api/recursos-humanos/personal-bodega';


  constructor(private http: HttpClient) {}


  registrarPersonalBodega(dto: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, dto);
  }


  obtenerBodegas(): Observable<BodegaDto[]>{
    return this.http.get<BodegaDto[]>(`${this.apiUrl}/bodegas`).pipe(
      catchError(error => {
        console.error('Error al obtener las bodegas:', error);
        throw error;
      })
    )
  }


  listarPersonalBodega(params: {
    idBodega?: string;
    fechaContratacion?: string;
    tipoContrato?: string;
    estadoContrato?: string;
    tipoCargo?: string;
    pagina?: number;
    size?: number;
  }): Observable<MensajeDto<PersonalBodegaDto[]>> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.http.get<MensajeDto<PersonalBodegaDto[]>>(`${this.apiUrl}/listar-personal-bodega`, { params: httpParams });
  }

}
