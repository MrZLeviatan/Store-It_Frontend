// Importación de decoradores y clases necesarias desde Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroCliente } from '../models/registroCliente.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible en toda la aplicación
})
export class RegistroClienteService {

  // URL del backend que maneja el registro de clientes
  private apiUrl = 'http://localhost:8080/api/clientes';

  // Inyección del cliente HTTP para hacer peticiones al backend
  constructor(private http: HttpClient) {}

  /**
   * Método que envía una solicitud POST al backend para registrar un nuevo cliente
   * @param cliente Objeto con los datos del cliente a registrar
   * @returns Observable con la respuesta del backend
   */
  crearCliente(cliente: RegistroCliente): Observable<RegistroCliente> {
    return this.http.post<RegistroCliente>(this.apiUrl, cliente);
  }

}


