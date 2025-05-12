// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideToastr } from 'ngx-toastr';
import {SocialAuthServiceConfig, SocialLoginModule} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import {JwtInterceptor} from './app/core/interceptors/jwt.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideToastr({
      timeOut: 5000, // Duración en ms
      positionClass: 'toast-top-right', // Posición en pantalla
      preventDuplicates: true, // Evita mostrar el mismo mensaje
      progressBar: true, // Barra de progreso
      progressAnimation: 'increasing', // Animación
      newestOnTop: true, // Orden de aparición
      closeButton: true // Botón para cerrar
    }),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '719752748978-o4ah1907npcfhqqb7eoh7ol49a8objga.apps.googleusercontent.com' // 👈 reemplázalo con el real
            )
          }
        ]
      } as SocialAuthServiceConfig
    }
  ]
});




