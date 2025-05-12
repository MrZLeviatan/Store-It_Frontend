import { Component, OnInit } from '@angular/core';
import { ClienteProductoService } from '../../../../core/service/api/cliente/producto/cliente-producto.service';
import { TokenService } from '../../../../core/service/token.service';
import { ProductoDto } from '../../../../core/models/common/producto.dto';
import { EspacioDto } from '../../../../core/models/common/espacio.dto';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-cliente-producto',
  templateUrl: 'gestionProductos.component.html',
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['gestionProductos.component.css']
})
export class ClienteProductoComponent implements OnInit {

  productos: ProductoDto[] = [];       // Lista de productos del cliente
  espacios: { [productoId: number]: EspacioDto } = {}; // Espacio por ID de producto
  cargando: boolean = false;           // Indicador de carga
  error: string | null = null;         // Mensaje de error

  productoSeleccionado: ProductoDto | null = null; // Producto actual para mostrar en modal

  constructor(
    private clienteProductoService: ClienteProductoService,
    private authToken: TokenService
  ) { }

  ngOnInit(): void {
    this.cargarProductosCliente();
  }

  /**
   * Load products for the current client based on token ID
   * Cargar productos para el cliente actual usando el ID del token
   */
  cargarProductosCliente(): void {
    this.cargando = true;
    const clienteId = this.authToken.getUserIdFromToken();

    if (clienteId === null) {
      this.cargando = false;
      this.error = 'No se pudo obtener el ID del cliente desde el token.';
      return;
    }

    this.clienteProductoService.listarProductosCliente(clienteId).subscribe({
      next: (productos) => {
        console.log('Productos recibidos:', productos); // Verifica qué datos recibes
        if (!productos || productos.length === 0) {
          this.error = 'No se encontraron productos para este cliente.';
          this.cargando = false;
          return;
        }

        this.productos = productos;
        this.cargando = false;

        productos.forEach(producto => {
          if (producto) {
            this.clienteProductoService.obtenerEspacioDeProducto(producto.id).subscribe({
              next: (espacio) => this.espacios[producto.id] = espacio,
              error: () => console.warn(`No se pudo cargar el espacio para el producto ${producto.id}`)
            });
          }
        });
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'No se pudieron cargar los productos del cliente.';
        console.error(err);
      }
    });

  }

  /**
   * Abre el modal para mostrar los detalles del producto seleccionado
   * Open modal with selected product details
   */
  abrirModal(producto: ProductoDto): void {
    this.productoSeleccionado = producto;
  }

  /**
   * Cierra el modal de detalles del producto
   * Close the product details modal
   */
  cerrarModal(): void {
    this.productoSeleccionado = null;
  }

}

