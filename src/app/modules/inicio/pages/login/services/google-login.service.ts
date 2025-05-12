// src/app/core/services/google-login.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../core/service/api/homePage/login/auth.service';
import { TokenService } from '../../../../../core/service/token.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({ providedIn: 'root' })
export class GoogleLoginService {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  initializeGoogleLogin(): void {
    (window as any).handleCredentialResponse = (response: any) => {
      const token = response.credential; // ✅ ID token JWT

      this.loginWithGoogleToken(token).subscribe({
        next: () => {
          // 🟢 Mostrar notificación de éxito
          this.toastr.success('Sesión iniciada con Google correctamente.', 'Éxito');
        },
        error: (err) => {
          // 🔴 Mostrar notificación de error personalizada o genérica
          if (err?.error?.respuesta) {
            this.toastr.error(err.error.respuesta, 'Error al iniciar sesión con Google');
          } else {
            this.toastr.error('Ocurrió un error inesperado al iniciar sesión con Google.', 'Error');
          }
        }
      });
    };

    // Cargar el script de Google Sign-In
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }



  loginWithGoogleToken(token: string): Observable<any> {
    return this.authService.loginWithGoogle({ token }).pipe(
      tap((response: { mensaje: { token: string } }) => {
        const token = response.mensaje.token;
        this.tokenService.saveToken(token);
        this.tokenService.debugDecodedToken();
        const rol = this.tokenService.getUserRole();

        switch (rol) {
          case 'ROLE_RECURSOS_HUMANOS': this.router.navigate(['/recursos-humanos']); break;
          case 'ROLE_CLIENTE': this.router.navigate(['/cliente']); break;
          case 'ROLE_AGENTE_VENTAS': this.router.navigate(['/agente-ventas']); break;
          case 'ROLE_PERSONAL_BODEGA': this.router.navigate(['/personal-bodega']); break;
        }
      })
    );
  }
}

