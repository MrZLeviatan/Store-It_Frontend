import { Component } from '@angular/core';
import { RegistroClienteService } from '../service/registroCliente.service';
import { RegistroCliente } from '../models/registroCliente.dto';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registrar-cliente',
  templateUrl: 'registroCliente-form.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['registroCliente-form.component.css']
})
export class RegistrarClienteComponent {
  cliente: RegistroCliente = {
    cedula: '',
    nombre: '',
    email: '',
    password: ''
  };

  constructor(
    private registroClienteService: RegistroClienteService) {}

  registrarUsuario(): void {
    this.registroClienteService.crearCliente(this.cliente).subscribe({
      next: () => alert('Cliente registrado exitosamente'),
      error: (err) =>
      {alert('Error: '+ (err.error?.mensaje || 'Error inesperado'
      ))}
    });
  }
}



