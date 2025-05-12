import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ClienteDto} from '../../../../models/cliente/profile/clienteDto.dto';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient) {}


  obtenerPerfil(id: any): Observable<{ mensaje: ClienteDto }> {
    return this.http.get<{ mensaje: ClienteDto }>(`${this.apiUrl}/perfil/${id}`);
  }


  // Editar cuenta de RRHH con FormData
  editarCuentaCliente(id: any, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-cuenta/${id}`, formData);
  }
}
