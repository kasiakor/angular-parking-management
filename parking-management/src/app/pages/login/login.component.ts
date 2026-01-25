import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/login.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: LoginRequest = new LoginRequest();
  userService = inject(UserService);
  router = inject(Router);

  onLogin() {
    this.userService.loginUser(this.loginObj).subscribe({
      next: (response) => {
        console.log('Login successful: userData', response);
        this.userService.setLoggedUser(response);
        // localStorage.setItem('userData', JSON.stringify(response));
        // this.userService.loggedUserData = response;
        this.router.navigateByUrl('dashboard');
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
