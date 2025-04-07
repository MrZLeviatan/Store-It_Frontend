import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroPersonalBodegaDto } from '../models/registroPersonalBodega.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class RegistroPersonalBodegaService{

  private apiUrl = 'http://localhost:8080/api/personal-bodega';

  constructor(private http: HttpClient) {}

  crearPersonalBodega(personalBodega: RegistroPersonalBodegaDto): Observable<RegistroPersonalBodegaDto> {
    return this.http.post<RegistroPersonalBodegaDto>(this.apiUrl, personalBodega);
  }

}
