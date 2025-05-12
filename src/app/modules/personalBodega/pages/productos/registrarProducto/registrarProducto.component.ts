import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../../../core/service/api/personalBodega/productos/personal-bodega-productos.service';
import { Router } from '@angular/router';
import { EspacioDto } from '../../../../../core/models/common/espacio.dto';
import { NgForOf, NgIf } from '@angular/common';
import { TokenService } from '../../../../../core/service/token.service';
import { ToastrService } from 'ngx-toastr'; // ✅ Inyectar ToastrService

@Component({
  selector: 'app-registrar-producto',
  templateUrl: './registrarProducto.component.html',
  styleUrls: ['./registrarProducto.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
})
export class RegistrarProductoComponent implements OnInit {
  // Formulario para registrar producto
  registrarProductoForm: FormGroup;
  espacios: EspacioDto[] = []; // Lista de espacios disponibles para el cliente
  emailCliente: string = ''; // Email del cliente ingresado en el formulario

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private authToken: TokenService,
    private toastr: ToastrService // Inyectar ToastrService
  ) {
    this.registrarProductoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      areaOcupada: ['', [Validators.required, Validators.min(1)]],
      altura: ['', [Validators.required, Validators.min(1)]],
      idEspacio: ['', [Validators.required]],
      emailCliente: ['', [Validators.required, Validators.email]],
      idPersonalBodega: ['', [Validators.required]],
      tipoProducto: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const userId = this.authToken.getUserIdFromToken();
    this.registrarProductoForm.patchValue({
      idPersonalBodega: userId,
    });
  }

  obtenerEspaciosPorCliente(): void {
    const emailCliente = this.registrarProductoForm.get('emailCliente')?.value;
    if (emailCliente) {
      this.productoService.obtenerEspaciosPorCliente(emailCliente).subscribe({
        next: (data) => {
          this.espacios = data;
        },
        error: (err) => {
          console.error('Error al obtener los espacios', err);
          this.espacios = [];
        }
      });
    } else {
      console.warn('El email del cliente está vacío o no es válido.');
    }
  }

  // Método para registrar el producto
  registrarProducto(): void {
    if (this.registrarProductoForm.valid) {
      const productoData = this.registrarProductoForm.value;
      this.productoService.crearProducto(productoData).subscribe({
        next: (response) => {
          // Mostrar mensaje de éxito con Toastr
          this.toastr.success('Producto registrado con éxito', 'Éxito');

          // Limpiar los valores del formulario después de registrar el producto
          this.registrarProductoForm.reset();
          this.espacios = [];
        },
        error: (err) => {
          // Mostrar mensaje de error con Toastr
          this.toastr.error('Error al registrar el producto', 'Error');
        }
      });
    }
  }

  // Obtener los controles del formulario para simplificar la validación
  get f() {
    return this.registrarProductoForm.controls;
  }
}

