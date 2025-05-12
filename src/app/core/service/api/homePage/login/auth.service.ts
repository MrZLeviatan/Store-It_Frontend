// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../../../../models/homePage/login/login.dto';
import { TokenDto } from '../../../../../modules/inicio/pages/login/model/tokenDto.dto';
import { MensajeDto } from '../../../../models/common/mensajeDto.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://192.168.1.12:8080/api/auth'; // Dominio base común



  constructor(private http: HttpClient) {
  }

  /**
   * Llama al endpoint de login tradicional con email y password
   */
  login(loginDto: LoginDto): Observable<MensajeDto<TokenDto>> {
    return this.http.post<MensajeDto<TokenDto>>(`${this.apiUrl}/login`, loginDto); // RUTA /login
  }

  /**
   * Llama al endpoint de login con Google
   * @param credentials Email de Google y el googleToken proporcionado por Google.
   */
  loginWithGoogle(credentials: { token: string }): Observable<MensajeDto<TokenDto>> {
    return this.http.post<MensajeDto<TokenDto>>(`${this.apiUrl}/login-google`, credentials);
  }


  // Enviar solicitud de restablecimiento / Send password reset request
  solicitarCodigoRestablecimiento(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/restablecer-password`,  {email} );
  }


  verificarCodigo(dto: { email: string; codigo: string }) {
    return this.http.post<any>(`${this.apiUrl}/verificar-codigo`, dto);
  }


  /**
   * Llamada al backend para actualizar la contraseña
   * @param dto DTO que contiene el email y la nueva contraseña
   */
  actualizarPassword(dto: { email: string; nuevaPassword: string})  {
    return this.http.put<any>(`${this.apiUrl}/actualizar-password`, dto);
  }


}
