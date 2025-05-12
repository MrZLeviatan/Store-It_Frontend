import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.respuesta) {
          console.error('⚠️ Error desde backend:', error.error.respuesta);
          this.toastr.error(error.error.respuesta, 'Error'); // Notificación elegante
        } else if (error.error?.mensaje) {
          console.error('⚠️ Error específico:', error.error.mensaje);
          this.toastr.error(error.error.mensaje, 'Error'); // Notificación elegante
        } else {
          console.error('❌ Error inesperado:', error);
          this.toastr.error('Ocurrió un error inesperado. Por favor, intenta más tarde.', 'Error');
        }

        return throwError(() => error);
      })
    );
  }
}

