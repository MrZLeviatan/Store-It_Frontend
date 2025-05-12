import {Component, OnInit} from '@angular/core';
import {PersonalBodegaDto} from '../../../../../core/models/personalBodega/profile/personalBodega.dto';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RecursosHumanosPersonalBodegaService } from '../../../../../core/service/api/recursosHumanos/personalBodega/recursos-humanos-personal-bodega.service';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'app-registrar-personal-bodega',
  templateUrl: 'listarPersonalBodega.component.html',
  styleUrls: ['listarPersonalBodega.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ]
})
export class ListarPersonalBodegaComponent implements OnInit {
  personalBodega: PersonalBodegaDto[] = [];
  filtroForm: FormGroup;
  personalSeleccionado: PersonalBodegaDto | null = null;

  constructor(
    private personalBodegaService: RecursosHumanosPersonalBodegaService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      idBodega: [''],
      fechaContratacion: [''],
      tipoContrato: [''],
      estadoContratoLaboral: [''],
      tipoCargo: [''],
      pagina: [0],
      size: [10]
    });
  }

  ngOnInit(): void {
    this.buscarPersonalBodega();
  }

  buscarPersonalBodega(): void {
    const filtros = { ...this.filtroForm.value };

    // Eliminar parámetros vacíos o null
    Object.keys(filtros).forEach(key => {
      if (filtros[key] === null || filtros[key] === '') {
        delete filtros[key];
      }
    });

    this.personalBodegaService.listarPersonalBodega(filtros).subscribe({
      next: res => this.personalBodega = res.mensaje,
      error: err => console.error(err)
    });
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({ pagina: 0, size: 10 });
    this.buscarPersonalBodega();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.filtroForm.patchValue({ pagina: nuevaPagina });
    this.buscarPersonalBodega();
  }

  abrirModal(agente: PersonalBodegaDto): void {
    this.personalSeleccionado = agente;
  }

  cerrarModal(): void {
    this.personalSeleccionado = null;
  }

}
