import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactoService } from '../../../../core/service/api/homePage/contacto/contacto.service';
import { MensajeContactoDto } from '../../../../core/models/homePage/contacto/mensajeContacto.dto';
import { FondoAnimadoComponent } from '../../../../shared/fondo-animado/fondo-animado.component';
import { NgClass, NgIf } from '@angular/common';
import { AnimacionBotonEmailService } from '../../../../shared/animation/animacion-botonEmail.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  templateUrl: 'contacto.component.html',
  styleUrls: ['contacto.component.css'],
  imports: [
    FondoAnimadoComponent,
    FormsModule,
    NgClass,
    NgIf
  ]
})
export class ContactoComponent {

  // DTO que contiene los datos del mensaje de contacto
  mensaje: MensajeContactoDto = {
    nombre: '',
    email: '',
    mensaje: '',
    asunto: ''
  };

  cargando: boolean = false; // Indica si se está enviando el mensaje
  enviado: boolean = false;  // Indica si el mensaje fue enviado con éxito

  @ViewChild('formularioContacto') formularioContacto!: NgForm;              // Referencia al formulario
  @ViewChild('sendButton') sendButton!: ElementRef<HTMLButtonElement>;       // Referencia al botón de enviar

  constructor(
    private contactoService: ContactoService,
    private animacionBotonService: AnimacionBotonEmailService // Inyección del servicio de animación
  ) {}

  /**
   * Envía el mensaje de contacto si el formulario es válido.
   * Luego ejecuta la animación del botón y limpia el formulario.
   */
  enviarCorreo(): void {
    if (this.formularioContacto.invalid) return;

    this.cargando = true;
    this.enviado = false;

    // Enviar mensaje al backend
    this.contactoService.enviarMensajeContacto(this.mensaje).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado = true;

        // Ejecutar animación del botón usando el servicio
        this.animacionBotonService.animarEnvio(this.sendButton.nativeElement, () => {
          this.enviado = false; // Reiniciar estado visual después de la animación
        });

        // Limpiar formulario después de enviar
        this.formularioContacto.resetForm();
      },
      error: err => {
        this.cargando = false;
        console.error('Error al enviar mensaje', err);
      }
    });
  }

}

