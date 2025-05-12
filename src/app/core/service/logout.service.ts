// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}

  logout(): void {
    // Limpiar sesión o token
    localStorage.clear(); // También puedes eliminar cookies si aplica
    localStorage.removeItem('token'); // O 'authToken' si usas otro nombre

    // Redirigir al login
    this.router.navigate(['/'] , {replaceUrl: true}); // o '/' según prefieras
    this.toastr.success('Cierre de sesión exitoso.');
  }
}
