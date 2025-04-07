import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthContainerComponent } from './components/auth-container/auth-container.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthContainerComponent],
  template: `<app-auth-container></app-auth-container>`
})
export class AppComponent {}

