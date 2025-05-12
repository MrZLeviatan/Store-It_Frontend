import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent} from '../../shared/top-bar/top-bat.component'

@Component({
  selector: 'app-layout-publico',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent],
  templateUrl: './layout-publico.component.html',
})
export class LayoutPublicoComponent {}
