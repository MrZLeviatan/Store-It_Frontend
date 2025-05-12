import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class RecursosHumanosAgenteVentasService {
  private apiUrl = 'http://localhost:8080/api/agente-ventas/clientes';

  constructor(private http: HttpClient) {}


  registrarCliente(dto: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro-cliente`, dto);
  }



}
