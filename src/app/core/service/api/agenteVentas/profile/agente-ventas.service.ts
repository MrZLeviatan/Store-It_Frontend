import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {SedeDto} from '../../../../models/common/sede.dto';
import {AgenteVentasDto} from '../../../../models/agenteVentas/profile/agenteVentas.dto';

@Injectable({
  providedIn: 'root',
})
export class AgenteVentasService {
  private apiUrl = 'http://192.168.1.12:8080/api/agente-ventas';

  constructor(private http: HttpClient) {}

  obtenerPerfil(id: any): Observable<{ mensaje: AgenteVentasDto }> {
    return this.http.get<{ mensaje: AgenteVentasDto }>(`${this.apiUrl}/perfil/${id}`);
  }


  // Editar cuenta de RRHH con FormData
  editarCuentaAgenteVentas(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-cuenta/${id}`, formData);
  }


  obtenerSede(id:any): Observable<{ mensaje: SedeDto }> {
    return this.http.get<{ mensaje: SedeDto }>(`${this.apiUrl}/perfil/${id}/sede`);
  }




}
