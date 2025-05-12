// social-login.config.ts
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const socialAuthConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('719752748978-o4ah1907npcfhqqb7eoh7ol49a8objga.apps.googleusercontent.com') // ⬅️ Reemplaza con tu client ID
    }
  ]
};
