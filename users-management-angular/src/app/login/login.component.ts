import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /*
  usersService: Used to call methods from the UsersService (like login functionality).
  router: Allows navigation between pages (e.g., redirecting to the profile page after login).
   */
  constructor(
    private readonly usersService: UsersService,
    private router: Router,
    private auth: AuthService
  ) { }

  /*
  email and password: These variables hold the input values entered by the user.
  errorMessage: Stores the error message to display if something goes wrong.
   */
  email: string = ''
  password: string = ''
  errorMessage: string = ''

  //IF USER CLICK ON LOGIN BUTTON
  async handleSubmit() {

    /*
    Checks if email and password are empty.
    If either is empty, it shows an error message ("Email and Password is required") using showError and stops further execution.
     */
    if (!this.email || !this.password) {
      this.showError("Email and Password is required");
      return
    }

    /*
    Calls the login method from the UsersService with the entered email and password.

    Waits for the server to respond (await).
    If the response's status code is 200, it:
    Stores the token and user role in the browser's local storage.
    Redirects the user to the /profile page using the Router.

    If the server returns an error (e.g., incorrect credentials), it shows the error message provided in the server response.

    If there's any error (e.g., server issue), it catches the error and displays the message using showError.
     */
    try {
      const response = await this.usersService.login(this.email, this.password);
      if (response.statusCode == 200) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.role)
        this.router.navigate(['/profile'])
      } else {
        this.showError(response.message)
      }
    } catch (error: any) {
      this.showError(error.message)
    }

  }


  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }

  

}

//2.37.60