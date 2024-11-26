import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-updateuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.css'] // Fixed 'styleUrl' to 'styleUrls'
})
export class UpdateuserComponent implements OnInit {

  // Injecting required services (UsersService for API calls, Router for navigation, ActivatedRoute for reading route parameters)
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  // Variables to store userId, user data, and error message
  userId: any; // Will hold the ID of the user fetched from the route
  userData: any = {}; // Object to hold the user data for update
  errorMessage: string = ''; // To display error messages to the user

  // Lifecycle hook called when the component is initialized
  //BASICALLY FIRST THING GET USER ID BY USERSERVICES WHENVER THIS COMPONENT GET RENDER
  ngOnInit(): void {
    this.getUserById(); // Fetch user data by ID
  }

  // Fetch user data by userId from the route
  async getUserById() {
    // Get userId from the route parameter The line this.userId = this.route.snapshot.paramMap.get('id'); retrieves the userId from the URL of the current route.
    this.userId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    // Check if userId or token is missing
    if (!this.userId || !token) {
      this.showError('User ID or Token is required'); // Display error if missing
      return;
    }

    try {
      // Call the service method to fetch user details
      let userDataResponse = await this.userService.getUsersById(this.userId, token);

      // Extract relevant user data from the response
      const { name, email, role, city } = userDataResponse.ourUsers;

      // Populate the userData object for editing
      this.userData = { name, email, role, city };
    } catch (error: any) {
      // Handle errors and display them
      this.showError(error.message);
    }
  }

  // Method to update the user data
  async updateUser() {
    // Confirm the update action with the user
    const confirmUpdate = confirm('Are you sure you want to update this user?');
    if (!confirmUpdate) return; // Exit if the user cancels

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      // Throw an error if the token is missing
      if (!token) {
        throw new Error('Token not found');
      }

      // Call the service method to update the user data
      const res = await this.userService.updateUser(this.userId, this.userData, token);
      console.log(res); // Log the response for debugging

      // Check if the update was successful
      if (res.statusCode === 200) {
        // Navigate to the users list if successful
        this.router.navigate(['/users']);
      } else {
        // Display an error message if the update fails
        this.showError(res.message);
      }
    } catch (error: any) {
      // Handle errors and display them
      this.showError(error.message);
    }
  }

  // Method to display error messages
  showError(mess: string) {
    this.errorMessage = mess; // Set the error message
    setTimeout(() => {
      this.errorMessage = ''; // Clear the error message after 3 seconds
    }, 3000);
  }
}
