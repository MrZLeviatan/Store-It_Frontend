import { Component } from '@angular/core';
import { LoginService } from '../service/login.service';
import { LoginGlobal } from '../models/loginGlobal.dto';
import { Router } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-login-global',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgClass,ReactiveFormsModule]
})
export class LoginFormComponent {

  mensaje: string = '';
  esError: boolean = false;

  usuario: LoginGlobal = {
    email: '',
    password: ''
  };

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  mostrarMensajeTemporal(texto: string, esError: boolean) {
    this.mensaje = texto;
    this.esError = esError;

    setTimeout(() => {
      const mensajeElemento = document.querySelector('.mensaje');
      if (mensajeElemento) {
        mensajeElemento.classList.add('fade-out');
        setTimeout(() => {
          this.mensaje = '';
          mensajeElemento.classList.remove('fade-out');
        }, 2000);
      }
    }, 5000);
  }

  loginUsuario() {
    this.loginService.login(this.usuario).subscribe({
      next: (respuesta) => {
        const tipoUsuario = respuesta.mensaje;
        const clienteId= respuesta.id;
        switch (tipoUsuario) {
          case 'CLIENTE':
            this.router.navigate([`/cliente/perfil/${clienteId}`]);
            this.mostrarMensajeTemporal('Ingreso Concebido',false)
            break;
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'VENDEDOR':
            this.router.navigate(['/vendedor/panel']);
            break;
          default:
            this.mostrarMensajeTemporal('Tipo de usuario no reconocido', true);
        }
      },
      error: (error) => {
        this.usuario.password = '';
        const mensajeError = error.error?.mensaje || 'Credenciales inválidas o error del servidor.';
        this.mostrarMensajeTemporal(mensajeError, true);
      }
    });
  }
}
