import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalBodegaDto } from '../../../../models/personalBodega/profile/personalBodega.dto';
import { BodegaDto } from '../../../../models/common/bodega.dto'

@Injectable({
  providedIn: 'root',
})
export class PersonalBodegaService {
  private apiUrl = 'http://localhost:8080/api/personal-bodega';

  constructor(private http: HttpClient) {}

  obtenerPerfil(id: any): Observable<{ mensaje: PersonalBodegaDto }> {
    return this.http.get<{ mensaje: PersonalBodegaDto }>(`${this.apiUrl}/perfil/${id}`);
  }


  // Editar cuenta de RRHH con FormData
  editarCuentaPersonalBodega(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-cuenta/${id}`, formData);
  }


  obtenerBodega(id:any): Observable<{ mensaje: BodegaDto }> {
    return this.http.get<{ mensaje: BodegaDto }>(`${this.apiUrl}/perfil/${id}/bodega`);
  }




}
