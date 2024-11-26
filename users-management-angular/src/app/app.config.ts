import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),  // Setting up routing for the app with the provided routes
    provideClientHydration(),  // Enabling hydration to load server-rendered content on the client
    provideHttpClient(),  // Configuring the HTTP client to handle API requests
    
    // provideAuth0({
    //   domain: 'YOUR_AUTH0_DOMAIN',  // Replace with your Auth0 domain
    //   clientId: 'YOUR_AUTH0_CLIENT_ID',  // Replace with your Auth0 client ID
    //   authorizationParams: {
    //     redirect_uri: window.location.origin,  // Redirect URL after authentication
    //   },
    // }),
  ]
};

//2.01.14