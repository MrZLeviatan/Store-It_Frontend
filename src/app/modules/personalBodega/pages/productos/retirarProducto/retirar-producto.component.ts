import { Component } from '@angular/core';
import { ProductoService } from '../../../../../core/service/api/personalBodega/productos/personal-bodega-productos.service';
import { ProductoDto } from '../../../../../core/models/common/producto.dto';
import { TokenService } from '../../../../../core/service/token.service';
import { ToastrService } from 'ngx-toastr'; // Importamos ToastrService
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-retirar-producto',
  templateUrl: './retirar-producto.component.html',
  styleUrls: ['./retirar-producto.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
})
export class RetirarProductoComponent {
  emailCliente: string = ''; // Email del cliente / Client's email
  productos: ProductoDto[] = []; // Lista de productos asociados al cliente / List of client's products
  productoSeleccionadoId: number | null = null; // ID del producto seleccionado / Selected product ID

  constructor(
    private productoService: ProductoService,
    private authToken: TokenService,
    private toastr: ToastrService  // Inyectamos el servicio Toastr
  ) {}

  // Obtener productos asociados al email del cliente / Get products by client's email
  buscarProductos(): void {
    this.productoService.obtenerProductosPorCliente(this.emailCliente).subscribe({
      next: (productos) => {
        this.productos = productos;
        if (productos.length === 0) {
          this.toastr.info('No se encontraron productos para este cliente.'); // Usamos Toastr para mostrar mensaje
        }
      },
      error: () => {
        this.toastr.error('Error al buscar productos del cliente.'); // Usamos Toastr para mostrar error
        this.productos = [];
      }
    });
  }

  // Retirar producto seleccionado / Withdraw selected product
  retirarProducto(): void {
    if (this.productoSeleccionadoId === null) {
      this.toastr.warning('Por favor seleccione un producto.'); // Toastr warning si no hay selección
      return;
    }

    const idPersonal = this.authToken.getUserIdFromToken(); // Obtener ID del personal desde token / Get personal ID from token

    if (idPersonal === null) {
      this.toastr.warning('No se pudo obtener el ID del personal. Asegúrate de haber iniciado sesión.'); // Toastr warning si no se obtiene el ID
      return;
    }

    const dto = {
      emailCliente: this.emailCliente,
      idProducto: this.productoSeleccionadoId,
      idPersonal: idPersonal
    };

    this.productoService.retirarProducto(dto).subscribe({
      next: (respuesta) => {
        this.toastr.success('Producto retirado exitosamente.'); // Toastr success en caso de éxito
        this.productoSeleccionadoId = null; // Vaciar el campo seleccionado
        this.productos = []; // Vaciar la lista de productos
      },
      error: () => {
        this.toastr.error('Ocurrió un error al retirar el producto.'); // Toastr error en caso de error
      }
    });
  }
}
