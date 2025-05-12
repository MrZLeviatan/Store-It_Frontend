// src/app/components/login/login.component.ts
import {Component, AfterViewInit, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from './services/login.service';
import { GoogleLoginService } from './services/google-login.service';
import { ToastrService } from 'ngx-toastr';
import { RestablecerPasswordService } from './services/restablecer-password.service';
import {VerificarCodigoService} from './services/verificar-codigo.service'
import {Subscription} from 'rxjs';
import { ActivatedRoute } from '@angular/router'; // ⬅️ Asegúrate de tener esto
import { NgZone } from '@angular/core';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule],
  standalone: true
})
export class LoginComponent implements AfterViewInit, OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  submitted: boolean = false;
  mostrarModal: boolean = false; // Estado del modal
  mostrarBanner: boolean = false; // Estado del banner para actualizar la contraseña
  codigoVerificadoSubscription: Subscription; // Suscripción para escuchar la verificación
  passwordForm: FormGroup;
  private emailDesdeUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private googleLoginService: GoogleLoginService,
    private toastr: ToastrService,
    public restablecerPasswordService: RestablecerPasswordService,
    private verificarCodigoService: VerificarCodigoService,
    private route: ActivatedRoute, // ⬅️ Inyecta el ActivatedRoute
    private zone: NgZone

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', Validators.required]
    });

    // Formulario para nueva contraseña
    this.passwordForm = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Nos suscribimos a los cambios de verificación de código
    this.codigoVerificadoSubscription = this.verificarCodigoService.codigoVerificadoSubject.subscribe(
      (verificado) => {
        if (verificado) {
          // Si el código fue verificado correctamente, mostramos el banner
          this.zone.run(() => {
            this.mostrarBanner= true;
          });
        }else{
          this.zone.run(() => {
            this.mostrarBanner= false;
          });
        }
      }
    );
  }


  ngAfterViewInit(): void {
    this.googleLoginService.initializeGoogleLogin()
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.loginForm.value.password || !this.loginForm.value.email) {
      this.toastr.warning('Por favor, completa los campos.'); // ⚠️ Mostrar advertencia
      return;
    }

    if (this.loginForm.value.email && this.email?.invalid) {
      this.toastr.warning('El correo electrónico no es válido.'); // ⚠️ Correo inválido
      return;
    }

    this.loginService.loginAndRedirect(this.loginForm.value).subscribe({
      next: () => {
        this.toastr.success('Inicio de sesión exitoso.'); // ✅ Login correcto
      },
      error: (err) => {
        // ✅ Si viene un mensaje del backend en formato esperado
        if (err?.error?.mensaje) {
          this.toastr.error(err.error.mensaje, 'Error'); // ❌ Error del backend
        } else {
          this.toastr.error('Credenciales inválidas o error del servidor.', 'Error'); // ❌ Fallback
        }
      }
    });
  }


  // Mostrar modal
  abrirModalRestablecer(): void {
    this.mostrarModal = true;
    this.restablecerPasswordService.enviado = false;
    this.restablecerPasswordService.restablecerForm.reset();
  }

  // Cerrar modal
  cerrarModalRestablecer(): void {
    this.mostrarModal = false;
  }


  ngOnInit(): void {

    // 👇 Extraer parámetros de la URL al iniciar
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const codigo = params['codigo'];

      if (email && codigo) {
        this.emailDesdeUrl = email; // ✅ Asignar email desde la URL
        this.verificarCodigoService.verificarCodigoDesdeLink();
      }
    });

    this.restablecerPasswordService.cerrarModal$.subscribe(() => {
      this.cerrarModalRestablecer(); // 🔒 Método que cierra el modal
    });
    this.verificarCodigoService.verificarCodigoDesdeLink();
  }


  actualizarPassword(): void {
    if (this.passwordForm.invalid || !this.emailDesdeUrl) return;

    const dto = {
      email: this.emailDesdeUrl,
      nuevaPassword: this.passwordForm.value.nuevaPassword
    };
    // Delegamos la lógica al servicio
    this.verificarCodigoService.actualizarPassword(dto);
  }




  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
