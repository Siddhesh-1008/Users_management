import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-nav',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink],
//   templateUrl: './nav.component.html',
//   styleUrl: './nav.component.css'
// })
// export class NavComponent implements OnInit {

//   // Injecting the UsersService to check authentication status and manage logout
//   constructor(private readonly userService: UsersService) {}

//   // Variables to track the user's authentication and roles
//   isAuthenticated: boolean = false;
//   isAdmin: boolean = false;
//   isUser: boolean = false;
//   isGuest: boolean = false;

//   // ngOnInit is called when the component is initialized
//   ngOnInit(): void {
//       // Check if the user is authenticated and their role (admin or user)
//       this.isAuthenticated = this.userService.isAuthenticated();
//       this.isAdmin = this.userService.isAdmin();
//       this.isUser = this.userService.isUser();
//       this.isGuest=this.userService.isGuest()
//   }

//   // Method to log the user out
//   logout(): void {
//     // Remove user authentication details from local storage
//     this.userService.logOut();

//     // Update the component's state to reflect that the user is logged out
//     this.isAuthenticated = false;
//     this.isAdmin = false;
//     this.isUser = false;
//     this.isGuest=false
//   }
// }


// @Component({
//   selector: 'app-nav',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink],
//   templateUrl: './nav.component.html',
//   styleUrls: ['./nav.component.css'], // Corrected 'styleUrl' to 'styleUrls'
// })
// export class NavComponent implements OnInit, OnDestroy {
//   isAuthenticated: boolean = false;
//   isAdmin: boolean = false;
//   isUser: boolean = false;
//   isGuest: boolean = false;

//   // To manage subscriptions
//   private subscriptions: Subscription = new Subscription();

//   constructor(private readonly userService: UsersService) {}

//   ngOnInit(): void {
//     // Subscribe to the authentication state
//     const authSubscription = this.userService.isAuthenticated$.subscribe((authStatus) => {
//       this.isAuthenticated = authStatus;
//       this.isGuest = !authStatus; // Update isGuest when authentication state changes
//     });

//     // Subscribe to the role state
//     const roleSubscription = this.userService.role$.subscribe((role) => {
//       this.isAdmin = role === 'ADMIN';
//       this.isUser = role === 'USER';
//       this.isGuest = role === 'GUEST';
//     });

//     // Add subscriptions to the Subscription object for cleanup
//     this.subscriptions.add(authSubscription);
//     this.subscriptions.add(roleSubscription);
//   }

//   logout(): void {
//     this.userService.logOut();

//     // Reactive observables will automatically update the component state
//     // No need to manually set isAuthenticated, isAdmin, etc.
//   }

//   ngOnDestroy(): void {
//     // Clean up subscriptions to prevent memory leaks
//     this.subscriptions.unsubscribe();
//   }
// }

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class NavComponent implements OnInit, OnDestroy {
  // Variables to track the user's authentication status and roles
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isGuest: boolean = false;

  // Subscription object to keep track of all subscriptions for cleanup
  private subscriptions: Subscription = new Subscription();

  // Injecting the UsersService to listen for authentication and role changes
  constructor(private readonly userService: UsersService) {}

  // Called when the component is initialized
  ngOnInit(): void {
    // Subscribe to the authentication state observable
    // This will update `isAuthenticated` and `isGuest` whenever the authentication status changes
    const authSubscription = this.userService.isAuthenticated$.subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
      this.isGuest = !authStatus; // If not authenticated, user is a guest
    });

    // Subscribe to the role state observable
    // This will update `isAdmin`, `isUser`, and `isGuest` whenever the role changes
    const roleSubscription = this.userService.role$.subscribe((role) => {
      this.isAdmin = role === 'ADMIN'; // Check if the user is an admin
      this.isUser = role === 'USER';  // Check if the user is a regular user
      this.isGuest = role === 'GUEST'; // Check if the user is a guest
    });

    // Add both subscriptions to the `subscriptions` object for easy cleanup
    this.subscriptions.add(authSubscription);
    this.subscriptions.add(roleSubscription);
  }

  // Method to log the user out
  logout(): void {
    // Calls the logout method in the UsersService to clear user details
    this.userService.logOut();

    // The changes in authentication state and role will automatically update
    // the component variables (`isAuthenticated`, `isAdmin`, etc.) via the observables
  }

  // Called when the component is destroyed
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.unsubscribe();
  }
}