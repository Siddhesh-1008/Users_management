import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from './users.service';

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(UsersService).isAuthenticated()) {
    return true;  // Allow access if authenticated
  } else {
    inject(Router).navigate(['/login']);  // Redirect to login if not authenticated
    return false;  // Deny access
  }
};

