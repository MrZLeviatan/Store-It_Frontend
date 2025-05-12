import { Injectable } from '@angular/core';
import gsap from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimacionBotonEmailService {


  /**
   * Aplica una animación estilo avión de papel al botón de envío.
   * @param button Elemento HTML del botón a animar.
   * @param onFinish Callback que se ejecuta cuando la animación finaliza completamente.
   */
  animarEnvio(button: HTMLButtonElement, onFinish: () => void): void {
    // Obtener variables CSS definidas en el botón
    const getVar = (v: string) => getComputedStyle(button).getPropertyValue(v);

    if (!button.classList.contains('active')) {
      button.classList.add('active');

      // 🛫 Animación de alas y cuerpo del avión
      gsap.to(button, {
        keyframes: [
          {
            '--left-wing-first-x': 50,
            '--left-wing-first-y': 100,
            '--right-wing-second-x': 50,
            '--right-wing-second-y': 100,
            duration: 0.4,
            onComplete() {
              gsap.set(button, {
                '--left-wing-first-y': 0,
                '--left-wing-second-x': 40,
                '--left-wing-second-y': 100,
                '--left-wing-third-x': 0,
                '--left-wing-third-y': 100,
                '--left-body-third-x': 40,
                '--right-wing-first-x': 50,
                '--right-wing-first-y': 0,
                '--right-wing-second-x': 60,
                '--right-wing-second-y': 100,
                '--right-wing-third-x': 100,
                '--right-wing-third-y': 100,
                '--right-body-third-x': 60
              });
            }
          },
          {
            '--left-wing-third-x': 20,
            '--left-wing-third-y': 90,
            '--left-wing-second-y': 90,
            '--left-body-third-y': 90,
            '--right-wing-third-x': 80,
            '--right-wing-third-y': 90,
            '--right-body-third-y': 90,
            '--right-wing-second-y': 90,
            duration: 0.4
          },
          {
            '--rotate': 50,
            '--left-wing-third-y': 95,
            '--left-wing-third-x': 27,
            '--right-body-third-x': 45,
            '--right-wing-second-x': 45,
            '--right-wing-third-x': 60,
            '--right-wing-third-y': 83,
            duration: 0.5
          },
          {
            '--rotate': 55,
            '--plane-x': -8,
            '--plane-y': 24,
            duration: 0.4
          },
          {
            '--rotate': 40,
            '--plane-x': 45,
            '--plane-y': -180,
            '--plane-opacity': 0,
            duration: 0.5
          }
        ]
      });

      // 🎉 Animación de éxito y reinicio del botón
      gsap.to(button, {
        keyframes: [
          {
            '--text-opacity': 0,
            '--border-radius': 0,
            '--left-wing-background': getVar('--primary-darkest'),
            '--right-wing-background': getVar('--primary-darkest'),
            duration: 0.3
          },
          {
            '--left-wing-background': getVar('--primary'),
            '--right-wing-background': getVar('--primary'),
            duration: 0.3
          },
          {
            '--left-body-background': getVar('--primary-dark'),
            '--right-body-background': getVar('--primary-darkest'),
            duration: 0.6
          },
          {
            '--success-opacity': 1,
            '--success-scale': 1,
            duration: 0.6,
            delay: 0.6,
            onComplete() {
              setTimeout(() => {
                button.removeAttribute('style');
                gsap.fromTo(button, {
                  opacity: 0,
                  y: -8
                }, {
                  opacity: 1,
                  y: 0,
                  clearProps: true,
                  duration: 0.3,
                  onComplete() {
                    if (onFinish) onFinish(); // ✅ Ejecutar callback final
                  }
                });
              }, 2000); // Espera antes de reiniciar el botón
            }
          }
        ]
      });
    }
  }
}
