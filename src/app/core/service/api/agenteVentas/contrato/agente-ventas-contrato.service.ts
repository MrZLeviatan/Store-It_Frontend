import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {BodegaDto} from '../../../../models/common/bodega.dto';
import {catchError , tap} from 'rxjs/operators';
import {EspacioDto} from '../../../../models/common/espacio.dto';
import {ContratoDto} from '../../../../models/common/contrato.dto';


@Injectable({
  providedIn: 'root',
})
export class AgenteVentasContratoService {
  private apiUrl = 'http://localhost:8080/api/agente-ventas/contrato';

  constructor(private http: HttpClient) {
  }

  // 🏢 Obtener todas las bodegas para el mapa
  obtenerBodegas(): Observable<BodegaDto[]> {
    return this.http.get<BodegaDto[]>(`${this.apiUrl}/bodegas`).pipe(
      catchError((error) => {
        console.error('Error al obtener las bodegas:', error);
        return throwError(() => error);
      })
    );
  }

  // 🗂 Obtener espacios disponibles por ID de bodega
  obtenerEspaciosPorBodega(idBodega: number): Observable<EspacioDto[]> {
    return this.http.get<EspacioDto[]>(`${this.apiUrl}/bodega/${idBodega}/espacios`).pipe(
      catchError((error) => {
        console.error('Error al obtener los espacios:', error);
        return throwError(() => error);
      })
    );
  }

  // 📄 Crear contrato con los datos del formulario
  crearContrato(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-contrato`, formData).pipe(
      tap((respuesta) => {
        console.log('Respuesta del backend:', respuesta); // 👈 Mensaje del backend
      }),
      catchError((error) => {
        console.error('Error al crear el contrato:', error);
        return throwError(() => error);
      })
    );
  }

  listarContratosAgente(params: {
    idAgente: string;
    fechaInicio?: string;
    estadoContrato?: string;
    pagina?: number;
    size?: number;
  }): Observable<ContratoDto[]> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.http.get<ContratoDto[]>(`${this.apiUrl}/agente/${params.idAgente}/contratos`, {
      params: httpParams,
    });
  }

}
