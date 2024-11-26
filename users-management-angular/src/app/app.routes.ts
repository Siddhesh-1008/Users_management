import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { adminGuard, usersGuard } from './users.guard';
import { ProfileComponent } from './profile/profile.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';
import { UserslistComponent } from './userslist/userslist.component';

export const routes: Routes = [
  // Route for the login page (no authentication required)
  { path: 'login', component: LoginComponent },

  // Route for the registration page, accessible only to admins
  { path: 'register', component: RegisterComponent, canActivate: [adminGuard] },

  // Route for the user profile page, accessible only to authenticated users
  { path: 'profile', component: ProfileComponent, canActivate: [usersGuard] },

  // Route to update a user by ID, accessible only to admins
  { path: 'update/:id', component: UpdateuserComponent, canActivate: [adminGuard] },

  // Route to view the list of users, accessible only to admins
  { path: 'users', component: UserslistComponent, canActivate: [adminGuard] },

  // Wildcard route to catch invalid paths, redirects to the login page
  { path: '**', component: LoginComponent },

  // Default route redirects to the login page
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
