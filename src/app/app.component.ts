import {Component, Inject, PLATFORM_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet} from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet],
})

export class AppComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private router: Router){

  }
}
