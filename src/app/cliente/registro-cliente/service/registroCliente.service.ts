import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroCliente } from '../models/registroCliente.dto';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroClienteService {

  // URL del backend que maneja el registro de clientes
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  crearCliente(cliente: RegistroCliente): Observable<RegistroCliente> {
    return this.http.post<RegistroCliente>(this.apiUrl, cliente);
  }

}

