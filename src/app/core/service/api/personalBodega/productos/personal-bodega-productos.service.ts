// producto.service.ts
// Servicio para manejar operaciones relacionadas con productos / Service to handle product operations

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrearProductoDto } from '../../../../models/personalBodega/registrarProducto/crearProducto.dto';
import { Observable } from 'rxjs';
import { EspacioDto } from '../../../../models/common/espacio.dto';
import {tap} from 'rxjs/operators';
import {ProductoDto} from '../../../../models/common/producto.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly baseUrl = 'http://192.168.1.12:8080/api/personal-bodega/producto'; // URL base del backend / Backend base URL

  constructor(private http: HttpClient) {}

  // Método para crear un nuevo producto / Method to create a new product
  crearProducto(producto: CrearProductoDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/registrar-producto`, producto, { responseType: 'text' })
      .pipe(
        tap(response => {
          console.log('Producto registrado con éxito:', response);  // Agrega el log aquí
        })
      );
  }

  // Método para obtener los espacios de un cliente por email / Method to get a client's spaces by email
  obtenerEspaciosPorCliente(email: string): Observable<EspacioDto[]> {
    return this.http.get<EspacioDto[]>(`${this.baseUrl}/cliente/${email}/espacios`);
  }


  // Método para retirar un producto / Method to withdraw a product
  retirarProducto(dto: { emailCliente: string, idPersonal: number, idProducto: number }): Observable<string> {
    return this.http.post(`${this.baseUrl}/retirar-producto`, dto, { responseType: 'text' }).pipe(
      tap(response => {
        console.log('Producto retirado con éxito:', response);
      })
    );
  }

  obtenerProductosPorCliente(email: string): Observable<ProductoDto[]> {
    return this.http.get<ProductoDto[]>(`${this.baseUrl}/cliente/${email}/productos`);
  }


}
