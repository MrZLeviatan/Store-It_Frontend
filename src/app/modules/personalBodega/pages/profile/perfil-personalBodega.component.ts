import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../../../core/service/token.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import {BodegaDto} from '../../../../core/models/common/bodega.dto';
import {PersonalBodegaDto} from '../../../../core/models/personalBodega/profile/personalBodega.dto'; // Importamos ToastrService
import {PersonalBodegaService} from '../../../../core/service/api/personalBodega/profile/personalBodega.service';


@Component({
  selector: 'app-perfil-personal-bodegas',
  standalone: true,
  templateUrl: 'perfil-personalBodega.component.html',
  styleUrls: ['perfil-personalBodega.component.css'],
  imports: [
    NgIf,
    FormsModule,
    NgxIntlTelInputModule
  ]
})
export class PerfilPersonalBodegaComponent implements OnInit {
  personalBodega!: PersonalBodegaDto;
  bodega!: BodegaDto;
  form: any = {}; // para el formulario de edición
  mostrarModal = false;
  imagenPerfilFile: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  mostrarModalImagen = false;
  imagenBodegaAmpliada: string = '';
  fotoActualIndex: number = 0;
  intervaloRotacion: any;

  constructor(
    private personalBodegaService: PersonalBodegaService,
    private authToken: TokenService,
    private toastr: ToastrService // Inyectamos ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
    this.obtenerBodega();
    this.iniciarRotacionFotos();
  }

  obtenerDatos() {
    const id = this.authToken.getUserIdFromToken();
    this.personalBodegaService.obtenerPerfil(id).subscribe({
      next: (res) => this.personalBodega = res.mensaje,
      error: (err) => console.error('Error al obtener perfil actualizado:', err)
    });
  }

  obtenerBodega(){
    const id = this.authToken.getUserIdFromToken();
    this.personalBodegaService.obtenerBodega(id).subscribe({
      next: (res) => this.bodega = res.mensaje,
      error: (err) => console.error('Error al obtener bodega actualizada:', err)
    });
  }


  // Método para abrir el modal con la imagen de la sede ampliada
  abrirModalImagen(foto: string) {
    this.imagenBodegaAmpliada = foto; // Asignar la URL de la imagen seleccionada
    this.mostrarModalImagen = true; // Mostrar el modal
  }

  // Método para cerrar el modal de la imagen
  cerrarModalImagen() {
    this.mostrarModalImagen = false; // Ocultar el modal
  }

  abrirModal() {
    this.form = {
      id: this.personalBodega.id,
      nombre: this.personalBodega.nombre,
      telefono: this.personalBodega.telefono,
      telefonoSecundario: this.personalBodega.telefonoSecundario
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

  iniciarRotacionFotos() {
    this.intervaloRotacion = setInterval(() => {
      if (this.bodega?.fotos?.length) {
        this.fotoActualIndex = (this.fotoActualIndex + 1) % this.bodega.fotos.length;
      }
    }, 20000); // cambia cada 3 segundos
  }

  ngOnDestroy(): void {
    if (this.intervaloRotacion) {
      clearInterval(this.intervaloRotacion);
    }
  }



  // Método para editar los datos de la cuenta
  editarCuenta() {
    const formData = new FormData();
    formData.append('idPersonalBodega', this.form.id);
    formData.append('nombre', this.form.nombre);
    formData.append('telefono', this.form.telefono.e164Number);
    formData.append('codigoPais', this.form.telefono?.countryCode?.toUpperCase()); // ej: 'CO'
    formData.append('telefonoSecundario', this.form.telefonoSecundario.e164Number);
    formData.append('codigoPaisSecundario', this.form.telefonoSecundario?.countryCode?.toUpperCase()); // ej: 'CO'
    if (this.imagenPerfilFile) {
      formData.append('imagenPerfil', this.imagenPerfilFile, this.imagenPerfilFile.name);
    }

    // Usamos el servicio para editar la cuenta
    this.personalBodegaService.editarCuentaPersonalBodega(this.authToken.getUserIdFromToken(), formData).subscribe({
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
