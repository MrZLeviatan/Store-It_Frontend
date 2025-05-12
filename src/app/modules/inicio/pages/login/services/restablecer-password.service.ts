// src/app/services/restablecer-password.service.ts
import {Injectable} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core/service/api/homePage/login/auth.service';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class RestablecerPasswordService {
  restablecerForm: FormGroup;
  enviado: boolean = false;
  private offsetX = 0;
  private offsetY = 0;
  private isDragging = false;


  // 🔔 Subject para notificar cierre del modal
  cerrarModal$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    // Crear formulario reactivo / Create reactive form
    this.restablecerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Enviar solicitud al backend si el correo es válido
   */
  enviarSolicitud(): void {
    this.enviado = true;

    if (this.restablecerForm.invalid) {
      this.toastr.warning('Por favor, introduce un correo electrónico válido.'); // ⚠️ Email inválido
      return;
    }

    const email = this.restablecerForm.value.email;

    this.authService.solicitarCodigoRestablecimiento(email).subscribe({
      next: () => {
        this.toastr.success('Se ha enviado el código de restablecimiento.'); // ✅ Éxito
        this.cerrarModal$.next(); // ✅ Notificamos al componente que debe cerrar el modal
      },
      error: (err) => {
        const mensaje = err?.error?.mensaje || 'No se pudo enviar el código. Intenta más tarde.';
        this.toastr.error(mensaje, 'Error'); // ❌ Error
      }
    });
  }


  startDrag(event: MouseEvent): void {
    const modal = (event.target as HTMLElement).closest('.modal') as HTMLElement;
    if (!modal || !(event.target as HTMLElement).classList.contains('modal-header')) return;

    this.isDragging = true;
    this.offsetX = event.clientX - modal.getBoundingClientRect().left;
    this.offsetY = event.clientY - modal.getBoundingClientRect().top;

    const move = (e: MouseEvent) => {
      if (!this.isDragging) return;
      modal.style.left = `${e.clientX - this.offsetX}px`;
      modal.style.top = `${e.clientY - this.offsetY}px`;
    };

    const stop = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', stop);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
  }

}
