import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <ng-container>
  <header class="header-container">
    <nav class="logo" (click)="navigateToHome()">
      <img src="assets/image/logo.png" alt="Logo de la boutique">
    </nav>

    <!-- Burger icon -->
    <div class="burger" (click)="toggleMenu()">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Menu -->
    <nav [class.open]="isMenuOpen" class="nav-menu">
      <ul>
        <li>
          <button (click)="navigateToHome()">Home</button>
        </li>
        <li>
          <button (click)="navigateBasedOnAuth()">
            {{ isLoggedIn ? 'Dashboard' : 'Login' }}
          </button>
        </li>
        <li>
          <button>Panier</button>
        </li>
      </ul>
    </nav>
  </header>
</ng-container>

  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;
  isLoggedIn = false;

   constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

 ngOnInit(): void {
    this.authService.getIsLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateBasedOnAuth() {
    if (this.isLoggedIn) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
