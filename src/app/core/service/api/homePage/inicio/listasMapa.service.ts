import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BodegaDto} from '../../../../models/common/bodega.dto';
import {SedeDto} from '../../../../models/common/sede.dto';
import {forkJoin, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListasMapaService {

  private baseUrl = 'http://192.168.1.12:8080/api/store-it';
  constructor(private http: HttpClient) {}


  obtenerMapas(): Observable<[BodegaDto[], SedeDto[]]> {
    return forkJoin([
      this.http.get<BodegaDto[]>(`${this.baseUrl}/bodegas`).pipe(
        catchError(error => {
          console.error('Error al obtener bodegas:', error);
          throw error; // Lanza el error para que se maneje en el subscribe
        })
      ),
      this.http.get<SedeDto[]>(`${this.baseUrl}/sedes`).pipe(
        catchError(error => {
          console.error('Error al obtener sedes:', error);
          throw error;
        })
      )
    ]);
  }
}
