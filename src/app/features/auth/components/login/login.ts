import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  providers: [LoginService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    this.errorMessage = '';
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    } else {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      // Call the login service to validate credentials
      this.validateUserCredentials(email, password);
    }
  }

  validateUserCredentials(email: string, password: string) {
    this.loginService.login(email, password).subscribe({
      next: (user) => {
        // Handle successful login, e.g., navigate to dashboard
        console.log('Login successful:', user);
        this.isLoading = false;

        if (!user) {
          alert('Invalid email or password. Please try again.');
          return;
        }
        this.loginService.saveSession(user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // Handle login error, e.g., show error message
        console.error('Login failed:', error);
        this.isLoading = false;
        this.errorMessage = 'An error occurred during login. Please try again.';
      },
    });
  }
}
