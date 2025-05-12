import { Component, Inject, OnInit, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListasMapaService } from '../../../../core/service/api/homePage/inicio/listasMapa.service';
import { CarruselService } from './service/carrusel.service';
import { MapaService } from './service/mapa.service';
import {FondoAnimadoComponent} from '../../../../shared/fondo-animado/fondo-animado.component';


@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  imports: [CommonModule, FondoAnimadoComponent],
})
export class InicioComponent implements OnInit {
  isBrowser: boolean;
  scrollOpacity: number = 0;
  servicios: any[] = [];
  contenidoActual = 0;
  menuOpen: boolean = false;

  // ✅ Constructor con inyecciones necesarias
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapaService: MapaService,
    private listasMapaService: ListasMapaService,
    private carruselService: CarruselService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ✅ Se ejecuta al iniciar el componente
  ngOnInit(): void {

    this.listasMapaService.obtenerMapas().subscribe({
      next: ([bodegas, sedes]) => {
        this.mapaService.initMap(bodegas, sedes);
      },
    });

    if (this.isBrowser) {
      this.servicios = this.carruselService.getServicios();
      setInterval(() => this.cambiarContenido(1), 15000);
    }
  }

  // ✅ Cambia el contenido mostrado del carrusel
  cambiarContenido(direccion: number): void {
    this.contenidoActual += direccion;
    if (this.contenidoActual < 0) {
      this.contenidoActual = this.servicios.length - 1;
    } else if (this.contenidoActual >= this.servicios.length) {
      this.contenidoActual = 0;
    }
  }

  // ✅ Actualiza el índice del carrusel según el scroll
  actualizarIndice(event: Event): void {
    const element = event.target as HTMLElement;
    const scrollLeft = element.scrollLeft;
    const itemWidth = element.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    this.contenidoActual = newIndex;
  }

  // ✅ Navega a la sección de contacto
  irAContacto() {
    this.router.navigate(['/contacto']);
  }
}
