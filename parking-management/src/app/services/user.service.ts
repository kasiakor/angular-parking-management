import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
  private http = inject(HttpClient);

  loginUser(obj: LoginRequest) {
    return this.http.post(
      'https://api.freeprojectapi.com/api/SmartParking/login',
      obj,
    );
  }
}
