import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthContainerComponent } from './components/auth-container/auth-container.component';
import {RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,  // Este es el lugar donde se renderizan las rutas
})
export class AppComponent {}

