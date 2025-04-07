import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginGlobal } from '../models/loginGlobal.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/Autentifcar/iniciarSesion';

  constructor(private http: HttpClient) {}

  login(usuario: LoginGlobal): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }
}

