import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>À propos</h3>
          <p>Votre boutique en ligne de confiance pour tous vos besoins.</p>
        </div>
        
        <div class="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="#" routerLink="/accueil">Accueil</a></li>
            <li><a href="#" routerLink="/produits">Produits</a></li>
            <li><a href="#" routerLink="/panier">Panier</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Contact</h3>
          <p>📧 contact@votreboutique.com</p>
          <p>📞 +33 1 23 45 67 89</p>
          <p>📍 123 Rue du Commerce, Paris</p>
        </div>
        
        <div class="footer-section">
          <h3>Suivez-nous</h3>
          <div class="social-links">
            <button class="social-btn">Facebook</button>
            <button class="social-btn">Twitter</button>
            <button class="social-btn">Instagram</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 Votre Boutique. Tous droits réservés.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background-color: #e0e5ec;
      padding: 3rem 2rem 1rem;
      margin-top: auto;
      box-shadow: 0 -5px 15px #a3b1c6, 0 5px 15px #ffffff;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-section {
      h3 {
        color: #333;
        font-size: 1.2rem;
        margin-bottom: 1rem;
        font-weight: 600;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 0.5rem;

          a {
            color: #666;
            text-decoration: none;
            transition: color 0.3s ease;

            &:hover {
              color: #333;
            }
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .social-btn {
        background: #e0e5ec;
        border: none;
        padding: 8px 16px;
        border-radius: 12px;
        box-shadow: 3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        color: #333;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff;
        }
      }
    }

    .footer-bottom {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #a3b1c6;

      p {
        color: #666;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 768px) {
      .footer-container {
        padding: 2rem 1rem 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .footer-section {
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {

}
