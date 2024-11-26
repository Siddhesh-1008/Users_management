import { Injectable } from '@angular/core';  // Importing Angular's Injectable decorator to make the service injectable
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Importing HttpClient to make HTTP requests
import { BehaviorSubject } from 'rxjs';


//BASICALLY SERVICE METHOD ARE USED TO MAKE CALL TO UR SPRING BOOT API AND FETCH DATA
// Marking the service as injectable so it can be used throughout the app
@Injectable({
  providedIn: 'root'  // This means the service is available globally across the app
})
export class UsersService {
  private BASE_URL = "http://localhost:8080";  // Base URL for the backend API
  

  //TO UPDATE THE NAV COMPONENT AUTMOAMTICALLY AS AUTHENTICATION STATE CHANGES
   // Reactive state subjects
   private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
   isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
 
   private roleSubject = new BehaviorSubject<string | null>(this.getRole());
   role$ = this.roleSubject.asObservable();
  


   
  constructor(private http: HttpClient) { }  // Injecting HttpClient to make HTTP requests

  // Method to login the user with email and password
  async login(email: string, password: string): Promise<any> {
    const url = `${this.BASE_URL}/auth/login`;  // Full URL to the login endpoint in the backend
    try {
      // Making a POST request with email and password, and returning the response as a promise
      const response = await this.http.post<any>(url, { email, password }).toPromise();

      //CAHNGES DONE
       // Update localStorage and emit new state
       if (response.token && response.role) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        this.isAuthenticatedSubject.next(true);
        this.roleSubject.next(response.role);
      }

      return response;  // Returning the response from the API (e.g., user data or token)
    } catch (error) {
      // Handling errors if the API request fails
      throw error;  // Throwing the error to be caught by the caller
    }
  }

  // Method to register a new user with user data and a token
  async register(userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/auth/register`;  // Full URL to the register endpoint in the backend

    // Setting up the Authorization header with a Bearer token (e.g., for authenticated requests)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adding the token to the headers
    });

    try {
      // Making a POST request to register the user with the provided user data and headers
      const response = await this.http.post<any>(url, userData, { headers }).toPromise();
      return response;  // Returning the response from the API (e.g., confirmation or user data)
    } catch (error) {
      // Handling any errors that occur during the API request
      throw error;  // Throwing the error so the caller can handle it
    }
  }

  // Method to get all users (admin access only)
  async getAllUsers(token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-all-users`;  // API endpoint to fetch all users
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adding the token to headers for authentication
    });
    try {
      // Sending a GET request with the token to fetch all users
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;  // Returning the response (list of users)
    } catch (error) {
      throw error;  // Throwing an error if the request fails
    }
  }

  // Method to get the profile of the currently logged-in user
  async getYourProfile(token: string): Promise<any> {
    const url = `${this.BASE_URL}/adminuser/get-profile`;  // API endpoint to get user profile
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adding the token to headers for authentication
    });
    try {
      // Sending a GET request with the token to fetch the logged-in user's profile
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;  // Returning the profile data
    } catch (error) {
      throw error;  // Throwing an error if the request fails
    }
  }

  // Method to get a specific user by ID (admin access)
  async getUsersById(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/get-users/${userId}`;  // API endpoint to get a user by ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adding the token to headers for authentication
    });
    try {
      // Sending a GET request with the token to fetch a specific user's data by ID
      const response = await this.http.get<any>(url, { headers }).toPromise();
      return response;  // Returning the user data
    } catch (error) {
      throw error;  // Throwing an error if the request fails
    }
  }

  // Method to delete a user by ID (admin access)
  async deleteUser(userId: string, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/delete/${userId}`;  // API endpoint to delete a user by ID
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adding the token to headers for authentication
    });
    try {
      // Sending a DELETE request with the token to delete the user
      const response = await this.http.delete<any>(url, { headers }).toPromise();
      return response;  // Returning the response after deleting the user
    } catch (error) {
      throw error;  // Throwing an error if the request fails
    }
  }

  // Method to update a user's details (admin access)
  async updateUser(userId: string, userData: any, token: string): Promise<any> {
    const url = `${this.BASE_URL}/admin/update/${userId}`;  // API endpoint to update a user's details
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Adding the token to headers for authentication
    });
    try {
      // Sending a PUT request with the token to update the user's data
      const response = await this.http.put<any>(url, userData, { headers }).toPromise();
      return response;  // Returning the updated user data
    } catch (error) {
      throw error;  // Throwing an error if the request fails
    }
  }

  /*** Authentication Methods ***/
  // Method to log out the user by removing token and role from localStorage
  //this methods are going to be used in guard to guard our endpoints which routes can be acessible by user admin and guest
  logOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');  // Removing the token from localStorage
      localStorage.removeItem('role');   // Removing the role from localStorage

        //CAHNGES DONE
        // Emit updated state
        this.isAuthenticatedSubject.next(false);
        this.roleSubject.next(null);
    }
    
  }

  // Method to check if the user is authenticated (has a valid token)
  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');  // Retrieving the token from localStorage
      return !!token;  // Returning true if the token exists (user is authenticated)
    }
    return false;  // Returning false if no token is found (user is not authenticated)
  }

  // Method to check if the user is an admin (role === 'ADMIN')
  isAdmin(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');  // Retrieving the role from localStorage
      return role === 'ADMIN';  // Returning true if the role is 'ADMIN'
    }
    return false;  // Returning false if the role is not 'ADMIN'
  }

  // Method to check if the user is a regular user (role === 'USER')
  isUser(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');  // Retrieving the role from localStorage
      return role === 'USER';  // Returning true if the role is 'USER'
    }
    return false;  // Returning false if the role is not 'USER'
  }

  // Method to check if the user is a regular user (role === 'GUEST')
  isGuest(): boolean {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');  // Retrieving the role from localStorage
      return role === 'GUEST';  // Returning true if the role is 'GUEST'
    }
    return false;  // Returning false if the role is not 'GUEST'
  }


  private getRole(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }


  

}
