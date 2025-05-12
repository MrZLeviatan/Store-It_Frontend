import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecursosHumanosAgenteVentasService } from '../../../../../core/service/api/agenteVentas/cliente/agente-ventas-cliente.service';
import { MapboxService } from './service/mapobox.service';
import { Subscription } from 'rxjs';
import {NgIf} from '@angular/common';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import {CrearClienteDto} from '../../../../../core/models/agenteVentas/registrarCliente/crearCliente.dto';


@Component({
  selector: 'app-registrar-cliente',
  templateUrl: './registrarCliente.component.html',
  styleUrls: ['./registrarCliente.components.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgxIntlTelInputModule
  ],
})
export class RegistrarClienteComponent implements OnInit {
  clienteForm!: FormGroup;
  imagenPreview: string | ArrayBuffer | null = null;
  map: any;
  ciudadPaisSubscription!: Subscription;
  paso: number = 1;


  private mapboxToken: string =
    'pk.eyJ1Ijoibmljb2xhczI4MTAwMiIsImEiOiJjbWFhaWRtam0xdjBrMnJvb2Zzd2w2eXQ3In0.EiKmTflHx-cs0GcxmrTN-w';


  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(15)]],
      telefonoSecundario: ['', [Validators.maxLength(15)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      tipoCliente: ['', Validators.required],
      pais: ['', Validators.required],
      ciudad: ['', Validators.required],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      imagenPerfil: [null],
    });
  }

  inicializarMapa(): void {
    setTimeout(() => {
      this.mapboxService.initializeMap('map', 4.710989, -74.072090, (coords) => {
        this.clienteForm.patchValue({
          latitud: coords.lat,
          longitud: coords.lng,
        });
        this.mapboxService.obtenerCiudadPais(coords.lat, coords.lng);
      });

      this.ciudadPaisSubscription = this.mapboxService.ciudadPais$.subscribe(({ciudad, pais}) => {
        this.clienteForm.patchValue({ciudad, pais});
      });
    }, 0);
  }


  constructor(
    private mapboxService: MapboxService,
    private fb: FormBuilder,
    private clienteService: RecursosHumanosAgenteVentasService,
    private toastr: ToastrService
  ) {
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción cuando el componente se destruya
    if (this.ciudadPaisSubscription) {
      this.ciudadPaisSubscription.unsubscribe();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.clienteForm.patchValue({imagenPerfil: file});
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  registrarCliente(): void {
    if (this.clienteForm.invalid || this.clienteForm.value.password !== this.clienteForm.value.confirmarPassword) {
      this.clienteForm.markAllAsTouched();
      this.toastr.error('Formulario inválido o las contraseñas no coinciden', 'Error de validación');
      return;
    }

    const formValue = this.clienteForm.value;

    const dto: CrearClienteDto = {
      nombre: formValue.nombre,
      telefono: formValue.telefono?.nationalNumber,
      codigoPais: formValue.telefono?.countryCode,
      telefonoSecundario: formValue.telefonoSecundario?.nationalNumber || '',
      codigoPaisSecundario: formValue.telefonoSecundario?.countryCode || '',
      imagenPerfil: formValue.imagenPerfil,
      user: {
        email: formValue.correo,
        password: formValue.password
      },
      ubicacion: {
        pais: formValue.pais,
        ciudad: formValue.ciudad,
        latitud: formValue.latitud,
        longitud: formValue.longitud
      },
      tipoCliente: formValue.tipoCliente
    }

    if (this.clienteForm.invalid) return;

    const formData = new FormData();
    formData.append('user.email', dto.user.email);
    formData.append('user.password', dto.user.password);
    formData.append('ubicacion.pais', dto.ubicacion.pais);
    formData.append('ubicacion.ciudad', dto.ubicacion.ciudad);
    formData.append('ubicacion.latitud', dto.ubicacion.latitud.toString());
    formData.append('ubicacion.longitud', dto.ubicacion.latitud.toString());
    formData.append('nombre', dto.nombre);
    formData.append('telefono', dto.telefono);
    formData.append('codigoPais', dto.codigoPais);
    formData.append('telefonoSecundario', dto.telefonoSecundario);
    formData.append('codigoPaisSecundario', dto.codigoPaisSecundario);
    formData.append('tipoCliente', dto.tipoCliente);
    formData.append('imagenPerfil', dto.imagenPerfil);


    this.clienteService.registrarCliente(formData).subscribe({
      next: () => {
        this.toastr.success('Agente registrado correctamente', 'Éxito')
        // 🧹 Limpiar visual y lógicamente el formulario
        this.clienteForm.reset(); // Borra todos los valores del formulario
        Object.keys(this.clienteForm.controls).forEach(key => {
          this.clienteForm.get(key)?.setErrors(null); // Limpia errores
          this.imagenPreview = null;
          this.ngOnDestroy();
        });
        this.paso = 1;
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error');
      }
    });
  }

  siguientePaso(): void {
    if (this.paso === 1) {
      const nombreInvalido = this.clienteForm.get('nombre')?.invalid;
      const correoInvalido = this.clienteForm.get('correo')?.invalid;
      const telefonoInvalido = this.clienteForm.get('telefono')?.invalid;
      const imagenPerfilInvalido = !this.clienteForm.get('imagenPerfil')?.value;

      if (nombreInvalido || correoInvalido || telefonoInvalido || imagenPerfilInvalido) {
        this.toastr.warning(
          'Por favor complete correctamente todos los campos del Paso 1, incluyendo la imagen de perfil.',
          'Advertencia'
        );
        this.clienteForm.markAllAsTouched();
        return;
      }
    }

    if (this.paso === 2) {
      const passwordInvalido = this.clienteForm.get('password')?.invalid;
      const confirmarPasswordInvalido = this.clienteForm.get('confirmarPassword')?.invalid;
      const tipoClienteInvalido = this.clienteForm.get('tipoCliente')?.invalid;
      const contraseñasCoinciden = this.clienteForm.get('password')?.value === this.clienteForm.get('confirmarPassword')?.value;

      if (passwordInvalido || confirmarPasswordInvalido) {
        this.toastr.warning('Por favor complete correctamente todos los campos del Paso 2.', 'Advertencia');
        this.clienteForm.markAllAsTouched();
        return;
      }
      if (!contraseñasCoinciden) {
        this.toastr.error('Las contraseñas no coinciden.', 'Error');
        return;
      }
    }
    this.paso++;

    if (this.paso == 3) {
      this.inicializarMapa();
    }
  }

  anteriorPaso(): void {
    this.paso--;
  }
}



