// app/animations.ts

import { keyframes } from '@angular/animations';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    animate('500ms ease-in', keyframes([
      style({ opacity: 0, transform: 'translateY(30px)', offset: 0 }),
      style({ opacity: 0.5, transform: 'translateY(10px)', offset: 0.5 }),
      style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
    ]))
  ]),
]);

