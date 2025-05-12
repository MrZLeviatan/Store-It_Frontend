import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecursosHumanosAgenteVentasService } from '../../../../../core/service/api/recursosHumanos/agenteVentas/recursos-humanos-agente-ventas.service';
import { ToastrService } from 'ngx-toastr';
import { CrearAgenteVentasDto } from '../../../../../core/models/recursosHumanos/registrarAgenteVentas/crearAgenteVentas.dto';
import {NgForOf, NgIf} from '@angular/common';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SedeDto} from '../../../../../core/models/common/sede.dto';

@Component({
  selector: 'app-registrar-agente',
  templateUrl: 'registroAgenteVentas.component.html',
  styleUrls: ['registroAgenteVentas.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgxIntlTelInputModule,
    FormsModule,
    NgForOf
  ]
})
export class RegistroAgenteVentasComponent implements OnInit {
  agenteForm!: FormGroup;
  imagenPreview: string | ArrayBuffer | null = null;
  paso: number = 1;
  sedes: SedeDto[] = []; // Lista de sedes disponibles

  ngOnInit(): void {
    this.agenteForm = this.fb.group({
      // Datos personales
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      telefonoSecundario: [''],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      imagenPerfil: [null],

      // Datos laborales
      sueldo: ['', Validators.required],
      tipoContrato: ['', Validators.required],
      fechaFinContrato: [''],
      emailEmpresarial: ['', [Validators.required, Validators.email]],
      idSede: [null, Validators.required]
    });
    this.listarSedes();
  }

  private listarSedes(): void {
    this.agenteService.obtenerSedes().subscribe({
      next: (sedes: SedeDto[]) => {
        this.sedes = sedes;
      },
      error: (err) => {
        console.error('Error al cargar sedes:', err);
        this.toastr.error('No se pudieron cargar las sedes', 'Error');
      }
    });
  }


  constructor(
    private fb: FormBuilder,
    private agenteService: RecursosHumanosAgenteVentasService,
    private toastr: ToastrService
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.agenteForm.patchValue({ imagenPerfil: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  get tipoContrato(): string {
    return this.agenteForm.get('tipoContrato')?.value;
  }

  registrarAgente(): void {
    if (this.agenteForm.invalid || this.agenteForm.value.password !== this.agenteForm.value.confirmarPassword) {
      this.agenteForm.markAllAsTouched();
      this.toastr.error('Formulario inválido o las contraseñas no coinciden', 'Error de validación');
      return;
    }

    const formValue = this.agenteForm.value;

    const dto: CrearAgenteVentasDto = {
      nombre: formValue.nombre,
      telefono: formValue.telefono?.nationalNumber,
      codigoTelefono: formValue.telefono?.countryCode,
      telefonoSecundario: formValue.telefonoSecundario?.nationalNumber || '',
      codigoTelefonoSecundario: formValue.telefonoSecundario?.countryCode || '',
      imagenPerfil: formValue.imagenPerfil,
      idSede: formValue.idSede,
      user: {
        email: formValue.correo,
        password: formValue.password
      },
      datosLaborales: {
        sueldo: formValue.sueldo,
        tipoContrato: formValue.tipoContrato,
        fechaContratacion: '',
        fechaFinContrato: formValue.tipoContrato === 'DEFINIDO' ? formValue.fechaFinContrato : null,
        emailEmpresarial: formValue.emailEmpresarial,
        estadoContratoLaboral: ''
      }
    };

    const formData = new FormData();
    formData.append('user.email', dto.user.email);
    formData.append('user.password', dto.user.password);
    formData.append('datosLaborales.sueldo', dto.datosLaborales.sueldo.toString());
    formData.append('datosLaborales.tipoContrato', dto.datosLaborales.tipoContrato);
    formData.append('datosLaborales.fechaFinContrato', dto.datosLaborales.fechaFinContrato || '');
    formData.append('datosLaborales.emailEmpresarial', dto.datosLaborales.emailEmpresarial);
    formData.append('datosLaborales.estadoContrato', dto.datosLaborales.estadoContratoLaboral);
    formData.append('nombre', dto.nombre);
    formData.append('telefono', dto.telefono);
    formData.append('codigoTelefono', dto.codigoTelefono);
    formData.append('telefonoSecundario', dto.telefonoSecundario);
    formData.append('codigoTelefonoSecundario', dto.codigoTelefonoSecundario);
    formData.append('idSede', dto.idSede.toString());
    formData.append('imagenPerfil', dto.imagenPerfil);

    this.agenteService.registrarAgenteVentas(formData).subscribe({
      next: () => {
        this.toastr.success('Agente registrado correctamente', 'Éxito')
        // 🧹 Limpiar visual y lógicamente el formulario
        this.agenteForm.reset(); // Borra todos los valores del formulario
        Object.keys(this.agenteForm.controls).forEach(key => {
          this.agenteForm.get(key)?.setErrors(null); // Limpia errores
          this.imagenPreview = null;
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
      const nombreInvalido = this.agenteForm.get('nombre')?.invalid;
      const correoInvalido = this.agenteForm.get('correo')?.invalid;
      const telefonoInvalido = this.agenteForm.get('telefono')?.invalid;
      const imagenPerfilInvalido = !this.agenteForm.get('imagenPerfil')?.value;

      if (nombreInvalido || correoInvalido || telefonoInvalido || imagenPerfilInvalido) {
        this.toastr.warning(
          'Por favor complete correctamente todos los campos del Paso 1, incluyendo la imagen de perfil.',
          'Advertencia'
        );
        this.agenteForm.markAllAsTouched();
        return;
      }
    }

    if (this.paso === 2) {
      const passwordInvalido = this.agenteForm.get('password')?.invalid;
      const confirmarPasswordInvalido = this.agenteForm.get('confirmarPassword')?.invalid;
      const contraseñasCoinciden = this.agenteForm.get('password')?.value === this.agenteForm.get('confirmarPassword')?.value;

      if (passwordInvalido || confirmarPasswordInvalido) {
        this.toastr.warning('Por favor complete correctamente todos los campos del Paso 2.', 'Advertencia');
        this.agenteForm.markAllAsTouched();
        return;
      }

      if (!contraseñasCoinciden) {
        this.toastr.error('Las contraseñas no coinciden.', 'Error');
        return;
      }
    }

    this.paso++;
  }

  anteriorPaso(): void {
    this.paso--;
  }
}

