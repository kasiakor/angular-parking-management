import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedUserData: LoginResponse | null = null;
  constructor() {
    const stored = localStorage.getItem('userData');
    if (stored) {
      this.loggedUserData = JSON.parse(stored);
      console.log('Loaded logged user from localStorage:', this.loggedUserData);
    }
  }
  private http = inject(HttpClient);

  loginUser(obj: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'https://api.freeprojectapi.com/api/SmartParking/login',
      obj,
    );
  }

  setLoggedUser(user: LoginResponse): void {
    this.loggedUserData = user;
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logOff(): void {
    this.loggedUserData = null;
    localStorage.removeItem('userData');
  }
}
