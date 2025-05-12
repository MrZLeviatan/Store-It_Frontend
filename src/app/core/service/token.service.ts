// token.service.ts
import { Injectable } from '@angular/core';
import {jwtDecode,JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'token';

  // Guarda el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtiene el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  // Obtiene el rol del usuario desde el token JWT
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || null;
    } catch (error) {
      console.error('❌ Error al decodificar token:', error);
      return null;
    }
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      return decoded.id || decoded.userId || decoded.sub || null; // ajusta según tu backend
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  // Solo para debug: muestra el contenido decodificado del token
  debugDecodedToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('✅ Token decodificado:', decoded);
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

}

