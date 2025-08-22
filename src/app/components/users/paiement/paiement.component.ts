import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-paiement',
  template: `
  <div>
    <h2>Paiement</h2>
    <p>Montant total : {{ totalPrice | currency }}</p>
    <div id="card-element"><!-- Stripe injecte ici le formulaire carte bancaire --></div>
    <button (click)="payer()">Payer</button>
  </div>
  `,
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent {
  accessToken = '';
  totalPrice = 0;

  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
    const infos = localStorage.getItem('paiement');
    if (infos) {
      const parsed = JSON.parse(infos);
      this.accessToken = parsed.accessToken;
      this.totalPrice = parsed.totalPrice;
    }
  }
  payer() {
    const payload = {
      accessToken: this.accessToken,
      amount: Math.round(this.totalPrice * 100) // convertir en centimes
    };

    console.log('Données envoyées à Stripe :', payload);

    this.http.post('http://localhost:8080/api/payment/create', payload)
      .subscribe({
        next: (res) => {
          console.log("Paiement Stripe OK", res);
          // tu peux rediriger ou stocker clientSecret ici
        },
        error: (err) => {
          console.error("Erreur Stripe :", err);
        }
      });
  }

}
