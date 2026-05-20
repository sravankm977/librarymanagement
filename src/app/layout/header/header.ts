import { Component } from '@angular/core';
import { LoginService } from '../../features/auth/services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  providers: [LoginService],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isUserLoggedIn = false;

  constructor(public loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.loginService.getSession(); // ✅ Check for existing session on init
    this.isUserLoggedIn = this.loginService.isLoggedIn(); // ✅ Update login status on init
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
