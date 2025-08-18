import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <ng-container>
      <header>
        <nav ngClass="logo">
          <img src="assets/image/logo.png" alt="Logo de la boutique">
        </nav>
        <nav>
          <ul>
            <button>Login</button>
            <button>Panier</button>
          </ul>
        </nav>
      </header>
    </ng-container>
    
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

}
