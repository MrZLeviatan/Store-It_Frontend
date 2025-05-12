import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {NgForOf, NgIf} from '@angular/common';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BodegaDto} from '../../../../../core/models/common/bodega.dto';
import { RecursosHumanosPersonalBodegaService} from '../../../../../core/service/api/recursosHumanos/personalBodega/recursos-humanos-personal-bodega.service';
import {CrearPersonalDto} from '../../../../../core/models/personalBodega/registrarPersonal/crearPersonal.dto';

@Component({
  selector: 'app-registrar-personal',
  templateUrl: 'registroPersonalBodega.component.html',
  styleUrls: ['registroPersonalBodega.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgxIntlTelInputModule,
    FormsModule,
    NgForOf
  ]
})
export class RegistrarPersonalComponent implements OnInit {
  bodegaForm!: FormGroup;
  imagenPreview: string | ArrayBuffer | null = null;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  paso: number = 1;
  bodegas: BodegaDto[] = []; // Lista de sedes disponibles

  ngOnInit(): void {1
    this.bodegaForm = this.fb.group({
      // Datos personales
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      telefonoSecundario: [''],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      tipoCargo: ['', Validators.required],
      imagenPerfil: [null],

      // Datos laborales
      sueldo: ['', Validators.required],
      tipoContrato: ['', Validators.required],
      fechaFinContrato: [''],
      emailEmpresarial: ['', [Validators.required, Validators.email]],
      idBodega: [null, Validators.required]
    });

    this.listarBodegas();
  }

  constructor(
    private fb: FormBuilder,
    private recursosHumanosPersonalBodegaService: RecursosHumanosPersonalBodegaService,
    private toastr: ToastrService
  ) {}

  private listarBodegas(): void {
    this.recursosHumanosPersonalBodegaService.obtenerBodegas().subscribe({
      next: (bodegas: BodegaDto[]) => {
        this.bodegas = bodegas;
      },
      error: (err) => {
        console.error('Error al cargar bodegas:', err);
        this.toastr.error('No se pudieron cargar las bodegas', 'Error');
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.bodegaForm.patchValue({ imagenPerfil: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  get tipoContrato(): string {
    return this.bodegaForm.get('tipoContrato')?.value;
  }

  registrarAgente(): void {
    if (this.bodegaForm.invalid || this.bodegaForm.value.password !== this.bodegaForm.value.confirmarPassword) {
      this.bodegaForm.markAllAsTouched();
      this.toastr.error('Formulario inválido o las contraseñas no coinciden', 'Error de validación');
      return;
    }

    const formValue = this.bodegaForm.value;

    const dto: CrearPersonalDto = {
      nombre: formValue.nombre,
      telefono: formValue.telefono?.nationalNumber,
      codigoTelefono: formValue.telefono?.countryCode,
      telefonoSecundario: formValue.telefonoSecundario?.nationalNumber || '',
      codigoTelefonoSecundario: formValue.telefonoSecundario?.countryCode || '',
      imagenPerfil: formValue.imagenPerfil,
      tipoCargo: formValue.tipoCargo,
      idBodega: formValue.idBodega,
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
    formData.append('idBodega', dto.idBodega.toString());
    formData.append('tipoCargo', dto.tipoCargo);
    formData.append('imagenPerfil', dto.imagenPerfil);

    this.recursosHumanosPersonalBodegaService.registrarPersonalBodega(formData).subscribe({
      next: () => {
        this.toastr.success('Personal de Bodega registrado correctamente', 'Éxito')
        // 🧹 Limpiar visual y lógicamente el formulario
        this.bodegaForm.reset(); // Borra todos los valores del formulario
        Object.keys(this.bodegaForm.controls).forEach(key => {
          this.bodegaForm.get(key)?.setErrors(null); // Limpia errores
          this.imagenPreview = null; // Limpia la vista previa de la imagen

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
      const nombreInvalido = this.bodegaForm.get('nombre')?.invalid;
      const correoInvalido = this.bodegaForm.get('correo')?.invalid;
      const telefonoInvalido = this.bodegaForm.get('telefono')?.invalid;
      const imagenPerfilInvalido = !this.bodegaForm.get('imagenPerfil')?.value;

      if (nombreInvalido || correoInvalido || telefonoInvalido || imagenPerfilInvalido) {
        this.toastr.warning(
          'Por favor complete correctamente todos los campos del Paso 1, incluyendo la imagen de perfil.',
          'Advertencia'
        );
        this.bodegaForm.markAllAsTouched();
        return;
      }
    }

    if (this.paso === 2) {
      const passwordInvalido = this.bodegaForm.get('password')?.invalid;
      const confirmarPasswordInvalido = this.bodegaForm.get('confirmarPassword')?.invalid;
      const contraseñasCoinciden = this.bodegaForm.get('password')?.value === this.bodegaForm.get('confirmarPassword')?.value;


      if (passwordInvalido || confirmarPasswordInvalido) {
        this.toastr.warning('Por favor complete correctamente todos los campos del Paso 2.', 'Advertencia');
        this.bodegaForm.markAllAsTouched();
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
