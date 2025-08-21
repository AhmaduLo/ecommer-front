import { Component } from "@angular/core";
import { Order } from "src/app/model/panier";
import { Product } from "src/app/model/Product";
import { PanierService } from "src/app/service/panier/panier.service";
import { ProductService } from "src/app/service/product/product.service";

@Component({
  selector: "app-panier",
  template: `
    <div class="panierContainer">
      <h2 class="panier-title">Votre Panier</h2>
      <div class="empty-cart" *ngIf="produits.length === 0">Le panier est vide.</div>

      <div class="cart-items" *ngIf="produits.length">
        <div class="cart-item" *ngFor="let produit of produits">
          <div class="product-image">
            <img [src]="produit.images?.[0]?.imageUrl || 'assets/images/placeholder.jpg'" [alt]="produit.name" class="product-img">
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ produit.name }}</h3>
            <p class="product-price">{{ produit.price | currency }}</p>
          </div>
          <button class="remove-btn" (click)="retirerDuPanier(produit.id)">Supprimer</button>
        </div>
      </div>

      <div class="cart-total" *ngIf="produits.length">
        <p class="total-price">Total : {{ total | currency }}</p>
      </div>

      <form class="checkout-form" (ngSubmit)="commander()" *ngIf="produits.length">
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
            placeholder="Adresse"
            required
          />
        </div>
        <button class="submit-btn" type="submit">Valider la commande</button>
      </form>
    </div>
  `,
  styleUrls: ["./panier.component.scss"],
})
export class PanierComponent {
  produits: Product[] = [];
  total = 0;

  fullName = '';
  userEmail = '';
  phoneNumber = '';
  address = '';

  constructor(
    private readonly panierService: PanierService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.chargerProduits();
  }

  chargerProduits() {
    const ids = this.panierService.getProduits();
    this.productService.getProducts().subscribe(allProducts => {
      this.produits = allProducts.filter(p => ids.includes(p.id));
      this.total = this.produits.reduce((s, p) => s + p.price, 0);
    });
  }
  retirerDuPanier(id: number) {
    this.panierService.retirerProduit(id);
    this.chargerProduits();
  }

  commander() {
    const order: Order = {
      fullName: this.fullName,
      userEmail: this.userEmail,
      phoneNumber: this.phoneNumber,
      address: this.address,
      productIds: this.produits.map(p => p.id),
    };

    this.panierService.envoyerCommande(order).subscribe({
      next: (res) => {
        alert('Commande enregistrée ! Token : ' + res.accessToken);
        this.panierService.viderPanier();
        this.chargerProduits();
      },
      error: (err) => console.error(err)
    });
  }
}
