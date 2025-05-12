import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core/service/api/homePage/login/auth.service';
import {Subject} from 'rxjs'; // Asegúrate de importar el servicio para restablecer

@Injectable({
  providedIn: 'root'
})
export class VerificarCodigoService {

  // Este subject se usará para comunicar la verificación exitosa
  codigoVerificadoSubject = new Subject<boolean>();

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private restablecerPasswordService: AuthService // Usamos el servicio para restablecer la contraseña
  ) {}

  /**
   * Método para capturar los parámetros de la URL y verificar el código
   */
  verificarCodigoDesdeLink(): void {
    // Capturamos los parámetros de la URL (email y código) si están presentes
    this.route.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      const codigo = params.get('codigo');

      if (email && codigo) {
        // Verificamos el código usando el servicio
        this.verificarCodigo({ email, codigo});
      }
    });
  }

  /**
   * Método para verificar el código de restablecimiento de contraseña
   * @param email El email del usuario
   * @param codigo El código de verificación
   */
  private verificarCodigo(dto: {email: string, codigo: string}): void {
    if (dto.email && dto.codigo) {
      // Llamamos al servicio para verificar el código
      this.restablecerPasswordService
        .verificarCodigo(dto).subscribe({
        next: (response) => {
            this.toastr.success('Código verificado correctamente');
            // Emitir evento para que se muestre el banner de actualización de contraseña
            this.codigoVerificadoSubject.next(true);
          },
          error: (err) => {
            this.toastr.error(
              err?.error?.mensaje || 'Código inválido o expirado',
              'Error'
            );
            // Si el código es incorrecto, redirigimos al login
            this.router.navigate(['/login']);
          },
        });
    }
  }


  /**
   * Actualiza la contraseña del usuario dado el email y la nueva contraseña
   * @param dto Objeto con el email y la nueva contraseña
   */
  actualizarPassword(dto: { email: string, nuevaPassword: string }): void {
    this.restablecerPasswordService.actualizarPassword(dto).subscribe({
      next: () => {
        this.toastr.success('Contraseña actualizada correctamente');
        this.codigoVerificadoSubject.next(false); // Cierra el banner
        this.router.navigate(['/login']); // Redirige al login
      },
      error: (err) => {
        this.toastr.error(err?.error?.mensaje || 'Error al actualizar la contraseña');
      }
    });
  }


}
