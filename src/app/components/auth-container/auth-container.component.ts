import { Component } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common'; // ✅ Importar CommonModule
import {LoginFormComponent} from '../../login/form/login-form.component';
import {RegistrarClienteComponent} from '../../cliente/registro-cliente/form/registroCliente-form.component';
import { fadeInOut } from './animations'; // ajusta la ruta si es necesario


@Component({
  selector: 'app-auth-container',
  templateUrl: 'auth-container.component.html',
  styleUrls: ['auth-container.component.css'],
  animations: [fadeInOut], // ✅ se declara la animación
  imports: [
    LoginFormComponent,
    RegistrarClienteComponent,
    NgIf
  ],

})
export class AuthContainerComponent {
  vista: 'login' | 'registro' = 'login';

  cambiarVista(vista: 'login' | 'registro') {
    this.vista = vista;
  }
}


