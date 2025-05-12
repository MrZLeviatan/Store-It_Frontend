import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FondoAnimadoComponent} from '../../../../shared/fondo-animado/fondo-animado.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule,FondoAnimadoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'] // Reutilizas tu CSS global si ya está cargado
})
export class AboutComponent { }
