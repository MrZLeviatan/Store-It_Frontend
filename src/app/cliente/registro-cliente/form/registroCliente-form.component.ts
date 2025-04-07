// Importaciones necesarias para componentes, servicios, formularios y utilidades comunes
import { Component } from '@angular/core';
import { RegistroClienteService } from '../service/registroCliente.service';
import { RegistroCliente } from '../models/registroCliente.dto';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  // Selector del componente utilizado en el HTML padre
  selector: 'app-registrar-cliente',

  // Ruta del archivo de plantilla HTML asociado a este componente
  templateUrl: 'registroCliente-form.component.html',

  // Este componente es standalone (no pertenece a un módulo), por lo tanto, importa sus propios módulos necesarios
  standalone: true,

  // Importaciones necesarias para el funcionamiento del componente (formularios, clases dinámicas, directivas comunes)
  imports: [
    FormsModule,
    NgClass,
    CommonModule,
    ReactiveFormsModule
  ],

  // Estilos específicos del componente
  styleUrls: ['registroCliente-form.component.css']
})
export class RegistrarClienteComponent {

  // Mensaje que se mostrará al usuario (ya sea éxito o error)
  mensaje: string = '';

  // Bandera para definir si el mensaje es de error o no
  esError: boolean = false;

  // Objeto que representa el cliente a registrar
  cliente: RegistroCliente = {
    cedula: '',
    nombre: '',
    email: '',
    password: ''
  };

  // Inyección del servicio de registro de cliente
  constructor(private registroClienteService: RegistroClienteService) {}

  // Método para mostrar un mensaje temporal (éxito o error)
  mostrarMensajeTemporal(texto: string, esError: boolean) {
    this.mensaje = texto;
    this.esError = esError;

    // Esperar 5 segundos antes de iniciar el desvanecimiento
    setTimeout(() => {
      const mensajeElemento = document.querySelector('.mensaje');

      if (mensajeElemento) {
        // Agrega la clase CSS que activa la animación de desvanecimiento
        mensajeElemento.classList.add('fade-out');

        // Espera 2 segundos para eliminar el mensaje y la clase
        setTimeout(() => {
          this.mensaje = '';
          mensajeElemento.classList.remove('fade-out'); // Elimina la clase para usarla en futuros mensajes
        }, 2000);
      }
    }, 5000);
  }

  // Método para registrar un cliente
  registrarUsuario() {
    this.registroClienteService.crearCliente(this.cliente).subscribe({
      // Si la respuesta es exitosa
      next: () => {
        // Limpia todos los campos del formulario
        this.cliente = {
          cedula: '',
          nombre: '',
          email: '',
          password: ''
        };

        // Muestra mensaje de éxito
        this.mostrarMensajeTemporal('Cliente registrado Exitosamente', false);
      },

      // Si ocurre un error
      error: (error) => {
        // Limpia solo la contraseña por seguridad
        this.cliente.password = '';

        // Obtiene el mensaje de error desde el backend si está disponible, si no muestra mensaje genérico
        const mensajeError = error.error && error.error.mensaje
          ? error.error.mensaje
          : 'Ha ocurrido un error inesperado.';

        // Muestra mensaje de error
        this.mostrarMensajeTemporal(mensajeError, true);
      }
    });
  }

}
