import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {RecursosHumanosDto} from '../../../../models/recursosHumanos/profile/recursosHumanos.dto';
import {SedeDto} from '../../../../models/common/sede.dto';

@Injectable({
  providedIn: 'root',
})
export class RecursosHumanosService {
  private apiUrl = 'http://192.168.1.12:8080/api/recursos-humanos';

  constructor(private http: HttpClient) {}

  obtenerPerfil(id: any): Observable<{ mensaje: RecursosHumanosDto }> {
    return this.http.get<{ mensaje: RecursosHumanosDto }>(`${this.apiUrl}/perfil/${id}`);
  }


  // Editar cuenta de RRHH con FormData
  editarCuentaRRHH(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-cuenta/${id}`, formData);
  }


  obtenerSede(id:any): Observable<{ mensaje: SedeDto }> {
    return this.http.get<{ mensaje: SedeDto }>(`${this.apiUrl}/perfil/${id}/sede`);
  }




}
