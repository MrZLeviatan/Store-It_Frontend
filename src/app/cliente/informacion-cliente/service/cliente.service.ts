// src/app/service/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la URL base del backend donde está el endpoint de clientes
const BASE_URL = 'http://localhost:8080/api/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  // Método para obtener la información del cliente por ID
  obtenerCliente(id: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/${id}`);
  }
}
