import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideClientHydration
} from '@angular/platform-browser';
import {
  provideAnimations
} from '@angular/platform-browser/animations';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { routes } from './app.routes';
import { LocationStrategy,HashLocationStrategy } from '@angular/common';
import {
  jwtInterceptor
} from './core/authentication/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideAnimations(),
    

    // provideClientHydration(),

    provideHttpClient(
      withInterceptors([
        jwtInterceptor
      ])
    )

  ]

};
