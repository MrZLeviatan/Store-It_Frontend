import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../../../core/service/logout.service';
import {RouterOutlet, RouterModule} from '@angular/router';

@Component({
  selector: 'app-personal-bodega-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './personal-bodega-home.component.html',
  styleUrls: ['./personal-bodega-home.component.css']
})
export class PersonalBodegaHomeComponent {
  isMobile: boolean = false;

  // Detecta cambios de tamaño en la pantalla
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkViewport();
  }

  ngOnInit(): void {
    document.body.classList.add('personal-bodega-body');
    this.checkViewport();
  }

  private checkViewport(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  activeSubmenu: string | null = null;

  // Alternar al hacer click (si también quieres esta opción)
  toggleSubmenu() {
    this.submenuAbierto = !this.submenuAbierto;
  }

  submenuAbierto = false;

  // Abrir al pasar el mouse
  abrirSubmenu() {
    if (window.innerWidth > 768) {
      this.submenuAbierto = true;
    }
  }


  cerrarSubmenu() {
    if (window.innerWidth > 768) {
      this.submenuAbierto = false;
    }
  }
  ngOnDestroy(): void {
    document.body.classList.remove('personal-bodega-body');
  }

  constructor( private logoutService: LogoutService) {
  }

  logout() :void {
    this.logoutService.logout();
  }


}
