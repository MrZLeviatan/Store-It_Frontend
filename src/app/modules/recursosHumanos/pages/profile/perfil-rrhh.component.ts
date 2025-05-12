import {Component, OnInit} from '@angular/core';
import {RecursosHumanosDto} from '../../../../core/models/recursosHumanos/profile/recursosHumanos.dto';
import {RecursosHumanosService} from '../../../../core/service/api/recursosHumanos/profile/recursos-humanos.service';
import {TokenService} from '../../../../core/service/token.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import {SedeDto} from '../../../../core/models/common/sede.dto'; // Importamos ToastrService


@Component({
  selector: 'app-perfil-rrhh',
  standalone: true,
  templateUrl: 'perfil-rrhh.component.html',
  styleUrls: ['perfil-rrhh.component.css'],
  imports: [
    NgIf,
    FormsModule,
    NgxIntlTelInputModule,
    NgForOf,
  ]
})
export class PerfilRrhhComponent implements OnInit {
  recursosHumanos!: RecursosHumanosDto;
  sede!: SedeDto;
  form: any = {}; // para el formulario de edición
  mostrarModal = false;
  imagenPerfilFile: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  mostrarModalImagen = false;
  imagenSedeAmpliada: string = '';

  constructor(
    private rhService: RecursosHumanosService,
    private authToken: TokenService,
    private toastr: ToastrService // Inyectamos ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerSede();
  }

  obtenerDatos() {
    const id = this.authToken.getUserIdFromToken();
    this.rhService.obtenerPerfil(id).subscribe({
      next: (res) => this.recursosHumanos = res.mensaje,
      error: (err) => console.error('Error al obtener perfil actualizado:', err)
    });
  }

  obtenerSede(){
    const id = this.authToken.getUserIdFromToken();
    this.rhService.obtenerSede(id).subscribe({
      next: (res) => this.sede = res.mensaje,
      error: (err) => console.error('Error al obtener sede actualizada:', err)
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
      id: this.recursosHumanos.id,
      nombre: this.recursosHumanos.nombre,
      telefono: this.recursosHumanos.telefono,
      telefonoSecundario: this.recursosHumanos.telefonoSecundario
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
    formData.append('idRRHH', this.form.id);
    formData.append('nombre', this.form.nombre);
    formData.append('telefono', this.form.telefono.e164Number);
    formData.append('codigoPais', this.form.telefono?.countryCode?.toUpperCase()); // ej: 'CO'
    formData.append('telefonoSecundario', this.form.telefonoSecundario.e164Number);
    formData.append('codigoPaisSecundario', this.form.telefonoSecundario?.countryCode?.toUpperCase()); // ej: 'CO'
    if (this.imagenPerfilFile) {
      formData.append('imagenPerfil', this.imagenPerfilFile, this.imagenPerfilFile.name);
    }

    // Usamos el servicio para editar la cuenta
    this.rhService.editarCuentaRRHH(this.authToken.getUserIdFromToken(), formData).subscribe({
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


