import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../core/service/api/homePage/login/auth.service';
import { TokenService } from '../../../../../core/service/token.service';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}


  // Realiza el login y redirige según el rol
  loginAndRedirect(credentials: { email: string; password: string }): Observable<any> {
    return this.authService.login(credentials).pipe(
      tap((response: { mensaje: { token: any } }) => {
        const token = response.mensaje.token;
        this.tokenService.saveToken(token);
        this.tokenService.debugDecodedToken();

        const rol = this.tokenService.getUserRole();

        switch (rol) {
          case 'ROLE_RECURSOS_HUMANOS':
            this.router.navigate(['/recursos-humanos']);
            break;
          case 'ROLE_CLIENTE':
            this.router.navigate(['/cliente']);
            break;
          case 'ROLE_AGENTE_VENTAS':
            this.router.navigate(['/agente-ventas']);
            break;
          case 'ROLE_PERSONAL_BODEGA':
            this.router.navigate(['/personal-bodega']);
            break;
        }
      })
    );
  }
}
