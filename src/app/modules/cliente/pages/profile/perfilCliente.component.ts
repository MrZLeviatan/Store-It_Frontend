import {Component, OnInit} from '@angular/core';
import {ClienteDto} from '../../../../core/models/cliente/profile/clienteDto.dto';
import {ClienteService} from '../../../../core/service/api/cliente/profile/cliente.service';
import {TokenService} from '../../../../core/service/token.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  templateUrl: 'perfilCliente.component.html',
  styleUrls: ['perfilCliente.component.css'],
  imports: [
    NgIf,
    FormsModule,
    NgxIntlTelInputModule
  ]
})
export class PerfilRrhhComponent implements OnInit {
  cliente!: ClienteDto;
  form: any = {}; // para el formulario de edición
  mostrarModal = false;
  imagenPerfilFile: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  mostrarModalImagen = false;
  imagenSedeAmpliada: string = '';

  constructor(
    private clienteService: ClienteService,
    private authToken: TokenService,
    private toastr: ToastrService // Inyectamos ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    const id = this.authToken.getUserIdFromToken();
    this.clienteService.obtenerPerfil(id).subscribe({
      next: (res) => this.cliente = res.mensaje,
      error: (err) => console.error('Error al obtener perfil actualizado:', err)
    });
  }



  // Método para abrir el modal con la imagen de la sede ampliada
  abrirModalImagen(foto: string) {
    this.imagenSedeAmpliada = foto; // Asignar la URL de la imagen seleccionada
    this.mostrarModalImagen = true; // Mostrar el modal
  }

  // Método para cerrar el modal de la imagen
  cerrarModalImagen() {
    this.mostrarModalImagen = false; // Ocultar el modal
  }

  abrirModal() {
    this.form = {
      id: this.cliente.id,
      nombre: this.cliente.nombre,
      telefono: this.cliente.telefono,
      telefonoSecundario: this.cliente.telefonoSecundario
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      this.imagenPerfilFile = file;

      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.toastr.error('Solo se permiten imágenes PNG o JPG');
      this.imagenPerfilFile = null;
      this.imagenPreview = null;
    }
  }



  // Método para editar los datos de la cuenta
  editarCuenta() {
    const formData = new FormData();
    formData.append('idCliente', this.form.id);
    formData.append('nombre', this.form.nombre);
    formData.append('telefono', this.form.telefono.e164Number);
    formData.append('codigoPais', this.form.telefono?.countryCode?.toUpperCase()); // ej: 'CO'
    formData.append('telefonoSecundario', this.form.telefonoSecundario.e164Number);
    formData.append('codigoPaisSecundario', this.form.telefonoSecundario?.countryCode?.toUpperCase()); // ej: 'CO'
    if (this.imagenPerfilFile) {
      formData.append('imagenPerfil', this.imagenPerfilFile, this.imagenPerfilFile.name);
    }

    // Usamos el servicio para editar la cuenta
    this.clienteService.editarCuentaCliente(this.authToken.getUserIdFromToken(), formData).subscribe({
      next: () => {
        this.toastr.success('Cuenta actualizada correctamente', 'Éxito');
        this.cerrarModal();
        this.obtenerDatos(); // Refrescar datos del perfil
      },
      error: (err) => {
        this.toastr.error(err.error.mensaje, 'Error al actualizar cuenta');
      }
    });
  }
}
