import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  userService = inject(UserService);
  router = inject(Router);

  onLogout() {
    this.userService.logOff();
    this.router.navigateByUrl('login');
  }
}
