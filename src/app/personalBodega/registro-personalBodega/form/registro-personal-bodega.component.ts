import { Component } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {RegistroPersonalBodegaService} from '../service/registroPersonalBodega.service';
import { RegistroPersonalBodegaDto } from '../models/registroPersonalBodega.dto';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-registro-personal-bodega',
  templateUrl: 'registro-personal-bodega.component.html',
  imports: [
    FormsModule,
    NgClass,
    CommonModule
  ],
  standalone: true,
  styleUrls: ['registro-personal-bodega.component.css']
})
export class RegistroPersonalBodegaComponent {

  // Mensaje que se mostrará al usuario (ya sea éxito o error)
  mensaje: string = '';

  // Bandera para definir si el mensaje es de error o no
  esError: boolean = false;

  personal: RegistroPersonalBodegaDto = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cargo: ''
  };

  constructor(private registroClienteService: RegistroPersonalBodegaService) {}

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

  registrarPersonalBodega(){
    this.registroClienteService.crearPersonalBodega(this.personal).subscribe({
      // Si la respuesta es exitosa
      next: () => {
        this.personal={
          id: '',
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          cargo: ''
        }
        this.mostrarMensajeTemporal('Personal Bodega registrado Exitosamente', false);
      },

      error: (error) => {

        const mensajeError = error.error && error.error.mensaje
          ? error.error.mensaje
          : 'Ha ocurrido un error inesperado.';

        // Muestra mensaje de error
        this.mostrarMensajeTemporal(mensajeError, true);
      }
      })
  }

}
