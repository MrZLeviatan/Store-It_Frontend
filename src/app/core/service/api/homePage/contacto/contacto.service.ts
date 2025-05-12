
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { MensajeContactoDto } from '../../../../models/homePage/contacto/mensajeContacto.dto';
import { MensajeDto} from '../../../../models/common/mensajeDto.dto';
import {catchError , tap} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:8080/api/store-it/contacto/enviar'; // Cambia al URL de tu backend

  constructor(private http: HttpClient) {}


  enviarMensajeContacto(dto:MensajeContactoDto): Observable<MensajeDto<string>> {
    return this.http.post<MensajeDto<string>>(this.apiUrl, dto).pipe(
    tap((respuesta) => {
      console.log('Respuesta del backend:', respuesta); // 👈 Mensaje del backend
    }),
      catchError((error) => {
        console.error('Error al enviar el correo', error);
        return throwError(() => error);
      })
  );

  }
}
