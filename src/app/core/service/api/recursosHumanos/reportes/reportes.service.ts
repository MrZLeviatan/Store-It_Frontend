import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SedeDto } from '../../../../models/common/sede.dto';
import { AgenteVentasDto } from '../../../../models/agenteVentas/profile/agenteVentas.dto';
import {ContratoDto} from '../../../../models/common/contrato.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private baseUrl = 'http://localhost:8080/api/recursos-humanos/reportes'; // Ruta base del backend

  constructor(private http: HttpClient) {}

  // 🇪🇸 Obtener todas las sedes desde el backend
  // 🇺🇸 Get all branches from the backend
  obtenerSedes(): Observable<SedeDto[]> {
    return this.http.get<SedeDto[]>(`${this.baseUrl}/sedes`);
  }

  // 🇪🇸 Obtener los agentes de ventas asociados a una sede específica
  // 🇺🇸 Get sales agents associated with a specific branch
  obtenerAgentesPorSede(idSede: number): Observable<AgenteVentasDto[]> {
    return this.http.get<AgenteVentasDto[]>(`${this.baseUrl}/agentes/${idSede}`);
  }

  // 🇪🇸 Obtener los contratos asociados a una lista de agentes de ventas
  // 🇺🇸 Get contracts associated with a list of sales agents
  obtenerContratosPorAgentes(agentes: AgenteVentasDto): Observable<ContratoDto[]> {
    return this.http.post<ContratoDto[]>(`${this.baseUrl}/contratos/por-agentes`, agentes);
  }
}
