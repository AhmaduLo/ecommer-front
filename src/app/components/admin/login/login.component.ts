import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/model/login';
import { AuthService } from 'src/app/service/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <h1>Login</h1>
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          formControlName="email"
          class="form-control" 
          placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          formControlName="password"
          class="form-control" 
          placeholder="Enter password">
      </div>
      <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary">
        Login
      </button>
      <div class="error" *ngIf="error">
        {{ error }}
      </div>
    </form>
  </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Email ou mot de passe incorrect';
        }
      },
      error: (err) => {
        this.error = 'Email ou mot de passe incorrect';
        console.error('Erreur de connexion:', err);
      }
    });
  }
}

}
