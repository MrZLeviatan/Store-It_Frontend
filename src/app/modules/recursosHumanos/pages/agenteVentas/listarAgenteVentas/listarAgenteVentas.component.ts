import {Component, OnInit} from '@angular/core';
import {AgenteVentasDto} from '../../../../../core/models/agenteVentas/profile/agenteVentas.dto';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RecursosHumanosAgenteVentasService } from '../../../../../core/service/api/recursosHumanos/agenteVentas/recursos-humanos-agente-ventas.service';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-registrar-agente',
  templateUrl: 'listarAgenteVentas.component.html',
  styleUrls: ['listarAgenteVentas.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ]
})
export class ListarAgentesVentasComponent implements OnInit {
  agentes: AgenteVentasDto[] = [];
  filtroForm: FormGroup;
  agenteSeleccionado: AgenteVentasDto | null = null;

  constructor(
    private agenteService: RecursosHumanosAgenteVentasService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      idSede: [''],
      fechaContratacion: [''],
      tipoContrato: [''],
      estadoContratoLaboral: [''],
      pagina: [0],
      size: [10]
    });
  }

  ngOnInit(): void {
    this.buscarAgentes();
  }

  buscarAgentes(): void {
    const filtros = { ...this.filtroForm.value };

    // Eliminar parámetros vacíos o null
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === null || filtros[key] === '') {
        delete filtros[key];
      }
    });

    this.agenteService.listarAgentes(filtros).subscribe({
      next: res => this.agentes = res.mensaje,
      error: err => console.error(err)
    });
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ pagina: 0, size: 10 });
    this.buscarAgentes();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.filtroForm.patchValue({ pagina: nuevaPagina });
    this.buscarAgentes();
  }

  abrirModal(agente: AgenteVentasDto): void {
    this.agenteSeleccionado = agente;
  }

  cerrarModal(): void {
    this.agenteSeleccionado = null;
  }

}
