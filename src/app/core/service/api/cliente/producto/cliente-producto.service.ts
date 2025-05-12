import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoDto } from '../../../../models/common/producto.dto';
import { EspacioDto } from '../../../../models/common/espacio.dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteProductoService {

  private baseUrl = 'http://192.168.1.12:8080/api/cliente/producto'; // Ruta base del backend

  constructor(private http: HttpClient) { }

  /**
   * Get the list of products associated with a client
   * Obtener la lista de productos asociados a un cliente
   */
  listarProductosCliente(idCliente: number): Observable<ProductoDto[]> {
    return this.http.get<ProductoDto[]>(`${this.baseUrl}/cliente/${idCliente}/productos`);
  }

  /**
   * Get the storage space associated with a product
   * Obtener el espacio de almacenamiento asociado a un producto
   */
  obtenerEspacioDeProducto(idProducto: number): Observable<EspacioDto> {
    return this.http.get<EspacioDto>(`${this.baseUrl}/producto/${idProducto}/espacio`);
  }
}
