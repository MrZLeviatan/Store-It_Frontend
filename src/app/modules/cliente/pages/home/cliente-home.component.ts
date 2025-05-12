import {Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../../../core/service/logout.service';
import {RouterOutlet, RouterModule} from '@angular/router';

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './cliente-home.component.html',
  styleUrls: ['./cliente-home.component.css']
})
export class ClienteHomeComponent {


  constructor( private logoutService: LogoutService) {
  }

  isMobile: boolean = false;


  // Detecta cambios de tamaño en la pantalla
  @HostListener('window:resize', [])
  onResize(): void {
    this.checkViewport();
  }

  ngOnInit(): void {
    document.body.classList.add('recursos-humanos-body');
    this.checkViewport();
  }

  private checkViewport(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnDestroy(): void {
    document.body.classList.remove('recursos-humanos-body');
  }

  logout() :void {
    this.logoutService.logout();
  }

}
