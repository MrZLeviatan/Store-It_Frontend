import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContratoDto } from '../../../../../core/models/common/contrato.dto';
import { AgenteVentasContratoService } from '../../../../../core/service/api/agenteVentas/contrato/agente-ventas-contrato.service';
import { TokenService } from '../../../../../core/service/token.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-listar-contrato',
  templateUrl: './listarContrato.component.html',
  styleUrls: ['./listarContrato.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ]
})
export class ListarContratoComponent implements OnInit {
  contratos: ContratoDto[] = []; // Lista de contratos // Contract list
  filtroForm: FormGroup; // Formulario de filtros // Filter form
  contratoSeleccionado: ContratoDto | null = null; // Contrato seleccionado para modal // Selected contract for modal

  constructor(
    private contratoService: AgenteVentasContratoService,
    private tokenService: TokenService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      fechaInicio: [''],
      estadoContrato: [''],
      pagina: [0],
      size: [10]
    });
  }

  ngOnInit(): void {
    const idAgente = this.tokenService.getUserIdFromToken();
    if (idAgente) {
      this.obtenerContratos(idAgente.toString());
    } else {
      console.error('No se encontró el ID del agente en el token'); // Agent ID not found in token
    }
  }

  // Obtener contratos según filtros // Get contracts using filters
  obtenerContratos(idAgente: string): void {
    const filtros = { ...this.filtroForm.value };

    // Eliminar filtros vacíos // Remove empty filters
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === null || filtros[key] === '') {
        delete filtros[key];
      }
    });

    this.contratoService.listarContratosAgente({
      idAgente,
      ...filtros
    }).subscribe({
      next: (res) => this.contratos = res,
      error: (err) => console.error('Error al obtener contratos:', err) // Error getting contracts
    });
  }

  // Ejecutar búsqueda manual // Trigger manual search
  buscarContratos(): void {
    this.filtroForm.patchValue({ pagina: 0 });
    const idAgente = this.tokenService.getUserIdFromToken();
    if (idAgente) {
      this.obtenerContratos(idAgente.toString());
    }
  }

  // Limpiar filtros y reiniciar búsqueda // Reset filters and refresh search
  limpiarFiltros(): void {
    this.filtroForm.reset({ fechaInicio: '', estadoContrato: '', pagina: 0, size: 10 });
    const idAgente = this.tokenService.getUserIdFromToken();
    if (idAgente) {
      this.obtenerContratos(idAgente.toString());
    }
  }

  // Cambiar página de resultados // Change result page
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0) {
      this.filtroForm.patchValue({ pagina: nuevaPagina });
      const idAgente = this.tokenService.getUserIdFromToken();
      if (idAgente) {
        this.obtenerContratos(idAgente.toString());
      }
    }
  }

  // Mostrar modal de contrato // Open contract modal
  abrirModal(contrato: ContratoDto): void {
    this.contratoSeleccionado = contrato;
  }

  // Cerrar modal de contrato // Close contract modal
  cerrarModal(): void {
    this.contratoSeleccionado = null;
  }
}
