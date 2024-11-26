import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from './users.service';
import { inject } from '@angular/core';

/*
usersGuard
This guard checks if the user is authenticated (logged in).
How it works:
It uses the UsersService to call the isAuthenticated() method.
If the user is authenticated, it allows access to the requested route by returning true.
If the user is not authenticated, it redirects them to the login page (/login) using the Router and denies access by returning false.
 */
export const usersGuard: CanActivateFn = (route, state) => {
  if (inject(UsersService).isAuthenticated()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false
  }
};

/*
adminGuard
This guard checks if the logged-in user has an admin role.
How it works:
It uses the UsersService to call the isAdmin() method.
If the user is an admin, it allows access to the requested route by returning true.
If the user is not an admin, it redirects them to the login page (/login) using the Router and denies access by returning false.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  if (inject(UsersService).isAdmin()) {
    return true;
  }else{
    inject(Router).navigate(['/login'])
    return false
  }
};