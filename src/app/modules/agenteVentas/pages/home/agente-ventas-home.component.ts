import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../../../core/service/logout.service';
import {RouterOutlet, RouterModule} from '@angular/router';

@Component({
  selector: 'app-agente-ventas-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './agente-ventas-home.component.html',
  styleUrls: ['./agente-ventas-home.component.css']
})
export class AgenteVentasHomeComponent {
  isMobile: boolean = false;


  // Detecta cambios de tamaño en la pantalla
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkViewport();
  }

  ngOnInit(): void {
    document.body.classList.add('agente-ventas-body');
    this.checkViewport();
  }

  private checkViewport(): void {
    this.isMobile = window.innerWidth <= 768;
  }




  // ======= Submenú Personal Bodega ========
  submenuContratoAbierto: boolean = false;

  toggleSubmenuContrato(): void {
    this.submenuContratoAbierto = !this.submenuContratoAbierto;
  }

  abrirSubmenuContrato(): void {
    if (window.innerWidth > 768) {
      this.submenuContratoAbierto = true;
    }
  }

  cerrarSubmenuContrato(): void {
    if (window.innerWidth > 768) {
      this.submenuContratoAbierto = false;
    }
  }

  constructor( private logoutService: LogoutService) {
  }

  logout() :void {
    this.logoutService.logout();
  }


}
