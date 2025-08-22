import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { PanierService } from 'src/app/service/panier/panier.service';
import { Order } from 'src/app/model/panier';
import { ModalService } from 'src/app/service/modal/modal.service';

@Component({
  selector: 'app-paiement',
  template: `
  <div class="payment-container">
    <h2>Paiement</h2>
    <p>Montant : {{ totalPrice | currency }}</p>

    <form class="payment-form">
      <h3>Informations de livraison</h3>
      
      <div class="form-group">
        <input
          class="form-input"
          [(ngModel)]="fullName"
          name="fullName"
          placeholder="Nom complet"
          required
        />
      </div>
      
      <div class="form-group">
        <input
          class="form-input"
          [(ngModel)]="userEmail"
          name="userEmail"
          type="email"
          placeholder="Email"
          required
        />
      </div>
      
      <div class="form-group">
        <input
          class="form-input"
          [(ngModel)]="phoneNumber"
          name="phoneNumber"
          placeholder="Téléphone"
          required
        />
      </div>
      
      <div class="form-group">
        <input
          class="form-input"
          [(ngModel)]="address"
          name="address"
          placeholder="Adresse complète"
          required
        />
      </div>

      <h3>Informations de paiement</h3>
      <label for="card-element">Carte bancaire :</label>
      <div id="card-element"><!-- Stripe injecte ici --></div>

      <button type="button" (click)="payer()" [disabled]="!canPay()">Payer</button>
    </form>
  </div>
  <app-modal></app-modal>
  `,
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent implements OnInit {

  stripe: Stripe | null = null;
  card!: StripeCardElement;
  clientSecret: string = '';

  accessToken = '';
  totalPrice = 0;
  
  // Données du formulaire
  fullName = '';
  userEmail = '';
  phoneNumber = '';
  address = '';

  constructor(
    private readonly http: HttpClient, 
    private readonly panierService: PanierService,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {
    // Récupération des infos de paiement
    const infos = localStorage.getItem('paiement');
    if (infos) {
      const parsed = JSON.parse(infos);
      this.totalPrice = parsed.totalPrice;

      // Créer une commande temporaire pour obtenir un token
      this.creerCommandeTemporaire();
    }
  }

  private async initializeStripeAndPayment(): Promise<void> {
    try {
      // Initialise Stripe.js
      this.stripe = await loadStripe('pk_test_51Rnf7mR04vCoCXhRDjCArx2oPAWemLEqConQUziMXeWPs8BVgJmueyofup7rvYs2cHAw4NRszNSwOxkKEEmiT6Nx00n9cztMyp');

      // Appel backend pour créer la session de paiement après avoir initialisé Stripe
      this.panierService.createPaiementSession(this.accessToken, Math.round(this.totalPrice * 100))
        .subscribe({
          next: async (res: { clientSecret: string; }) => {
            console.log("Paiement Stripe OK", res);
            this.clientSecret = res.clientSecret;

            if (this.stripe) {
              const elements = this.stripe.elements();
              this.card = elements.create('card');
              this.card.mount('#card-element');
            }
          },
          error: (err: any) => {
            console.error("Erreur Stripe :", err);
            this.modalService.showError("Erreur lors de l'initialisation du paiement Stripe.");
          }
        });
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Stripe:", error);
    }
  }

  canPay(): boolean {
    return this.fullName.trim() !== '' &&
           this.userEmail.trim() !== '' &&
           this.phoneNumber.trim() !== '' &&
           this.address.trim() !== '' &&
           this.stripe !== null &&
           this.clientSecret !== '';
  }

  creerCommandeTemporaire(): void {
    const currentInfos = this.panierService.getPaiementInfos();
    
    // Créer une commande temporaire avec des données vides
    const orderTemp: Order = {
      fullName: 'temp',
      userEmail: 'temp@temp.com',
      phoneNumber: 'temp',
      address: 'temp',
      productIds: currentInfos.items.map((item: any) => item.productId),
      items: currentInfos.items
    };

    // Envoyer la commande temporaire pour obtenir un token
    this.panierService.envoyerCommande(orderTemp).subscribe({
      next: (res) => {
        this.accessToken = res.accessToken;
        
        // S'assurer que le token est disponible pour l'intercepteur
        localStorage.setItem('token', this.accessToken);

        // Initialisation asynchrone de Stripe avec le vrai token
        this.initializeStripeAndPayment();
      },
      error: (err) => {
        console.error("Erreur lors de la création de commande temporaire :", err);
        this.modalService.showError("Erreur lors de l'initialisation du paiement.");
      }
    });
  }

  updatePaiementInfosWithFormData(): void {
    const currentInfos = this.panierService.getPaiementInfos();
    this.panierService.setPaiementInfos(
      this.accessToken,
      this.totalPrice,
      {
        fullName: this.fullName,
        userEmail: this.userEmail,
        phoneNumber: this.phoneNumber,
        address: this.address
      },
      currentInfos.items
    );
  }

  creerEtConfirmerCommande(paymentIntentId: string): void {
    // Mettre à jour les données de la commande avec les vraies infos du formulaire
    this.updatePaiementInfosWithFormData();
    
    // Confirmer avec le paymentIntentId
    this.panierService.confirmerCommande(paymentIntentId, this.accessToken).subscribe({
      next: (response) => {
        console.log("Confirmation réussie:", response);
        this.modalService.showSuccess("Commande confirmée avec succès !");

        // Nettoyer le localStorage après succès
        localStorage.removeItem('paiement');
        this.panierService.viderPanier();
        // Rediriger vers une page de confirmation ou l'accueil
        // this.router.navigate(['/confirmation']);
      },
      error: (err) => {
        console.error("Erreur lors de la confirmation :", err);
        this.modalService.showError("Erreur lors de la confirmation de commande. Le paiement a été effectué mais la commande pourrait ne pas être enregistrée. Contactez le support.");
      }
    });
  }
  async payer() {
    if (!this.stripe || !this.clientSecret) {
      this.modalService.showError("Erreur: Stripe n'est pas initialisé correctement");
      return;
    }

    // S'assurer que le token est toujours disponible
    if (this.accessToken && !localStorage.getItem('token')) {
      localStorage.setItem('token', this.accessToken);
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: 'Client invité'
          }
        }
      });

      if (error) {
        this.modalService.showError("Erreur lors du paiement : " + error.message);
      } else if (paymentIntent?.status === 'succeeded') {
        this.modalService.showSuccess("Paiement réussi !");

        // Créer la commande avec les données du formulaire
        this.creerEtConfirmerCommande(paymentIntent.id);
      }
    } catch (error) {
      console.error("Erreur générale lors du paiement:", error);
      this.modalService.showError("Erreur inattendue lors du paiement");
    }
  }
}

