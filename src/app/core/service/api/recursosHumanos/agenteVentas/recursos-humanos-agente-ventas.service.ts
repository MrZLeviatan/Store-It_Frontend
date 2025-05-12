import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SedeDto} from '../../../../models/common/sede.dto';
import {catchError, tap} from 'rxjs/operators';
import {MensajeDto} from '../../../../models/common/mensajeDto.dto';
import {AgenteVentasDto} from '../../../../models/agenteVentas/profile/agenteVentas.dto';


@Injectable({
  providedIn: 'root',
})
export class RecursosHumanosAgenteVentasService{
  private apiUrl = 'http://192.168.1.12:8080/api/recursos-humanos/agentes-ventas';


  constructor(private http: HttpClient) {}


  registrarAgenteVentas(dto: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, dto).pipe(
      tap((respuesta) => {
        console.log('Respuesta del backend al registrar agente:', respuesta); // 👈 Mensaje del backend
      }),
      catchError((error) => {
        console.error('Error al registrar el agente de ventas:', error);
        return throwError(() => error);
      })
    );
  }



  obtenerSedes(): Observable<SedeDto[]>{
    return this.http.get<SedeDto[]>(`${this.apiUrl}/sedes`).pipe(
      catchError(error => {
        console.error('Error al obtener sedes:', error);
        throw error;
      })
    )
  }


  listarAgentes(params: {
    idSede?: string;
    fechaContratacion?: string;
    tipoContrato?: string;
    estadoContratoLaboral?: string;
    pagina?: number;
    size?: number;
  }): Observable<MensajeDto<AgenteVentasDto[]>> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.http.get<MensajeDto<AgenteVentasDto[]>>(`${this.apiUrl}/listar-agentes`, { params: httpParams });
  }


}
