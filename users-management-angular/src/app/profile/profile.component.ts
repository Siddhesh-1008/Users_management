import { CommonModule } from '@angular/common'; // Provides Angular's common directives like *ngIf, *ngFor
import { Component, OnInit } from '@angular/core'; // Component decorator and lifecycle interface
import { UsersService } from '../users.service'; // Service for user-related API calls
import { Router } from '@angular/router'; // Router for navigation

@Component({
  selector: 'app-profile', // The tag used to include this component in HTML
  standalone: true, // Indicates this component is a standalone module
  imports: [CommonModule], // Modules this component depends on
  templateUrl: './profile.component.html', // Path to the HTML template
  styleUrl: './profile.component.css' // Path to the CSS file
})
export class ProfileComponent implements OnInit {

  // Injecting services into the constructor
  constructor(
    private readonly userService: UsersService, // Service to fetch user data
    private readonly router: Router // Service to navigate between routes
  ) {}

  // Holds the profile data fetched from the server
  profileInfo: any;

  // Holds error messages, if any
  errorMessage: string = '';

  // Lifecycle hook: Runs automatically when the component loads
  async ngOnInit() {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token');
      
      // If no token is found, throw an error
      if (!token) {
        throw new Error("No Token Found");
      }

      // Call the UsersService to fetch profile information using the token
      this.profileInfo = await this.userService.getYourProfile(token);
    } catch (error: any) {
      // Display error message if fetching profile info fails
      this.showError(error.message);
    }
  }

  // Method to navigate to the update profile page with the login user's ID
  updateProfile(id: string) {
    this.router.navigate(['/update', id]); // Navigate to '/update/:id' route
  }

  // Method to show an error message for 3 seconds
  showError(mess: string) {
    this.errorMessage = mess; // Set the error message
    setTimeout(() => {
      this.errorMessage = ''; // Clear the message after 3 seconds
    }, 3000);
  }
}
