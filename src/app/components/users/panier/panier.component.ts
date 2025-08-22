import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Order, OrderItem } from "src/app/model/panier";
import { Product } from "src/app/model/Product";
import { PanierService } from "src/app/service/panier/panier.service";
import { ProductService } from "src/app/service/product/product.service";
import { ModalService } from "src/app/service/modal/modal.service";

interface ProduitPanier extends Product {
  quantity: number;
}

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
            <p class="product-price">{{ produit.price | currency }} x {{ produit.quantity }}</p>
            <p class="product-subtotal">Sous-total: {{ (produit.price * produit.quantity) | currency }}</p>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn" (click)="diminuerQuantite(produit.id)">-</button>
            <span class="quantity-display">{{ produit.quantity }}</span>
            <button class="quantity-btn" (click)="augmenterQuantite(produit.id)">+</button>
          </div>
          <button class="remove-btn" (click)="retirerDuPanier(produit.id)">Supprimer</button>
        </div>
      </div>

      <div class="cart-total" *ngIf="produits.length">
        <p class="total-price">Total : {{ total | currency }}</p>
      </div>

      <div class="checkout-actions" *ngIf="produits.length">
        <button class="submit-btn" (click)="commander()">Procéder au paiement</button>
      </div>
    </div>
    <app-modal></app-modal>
  `,
  styleUrls: ["./panier.component.scss"],
})
export class PanierComponent {
  produits: ProduitPanier[] = [];
  total = 0;

  constructor(
    private readonly panierService: PanierService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.chargerProduits();
  }

  chargerProduits() {
    const items = this.panierService.getItems();
    this.productService.getProducts().subscribe(allProducts => {
      this.produits = items.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        return { ...product!, quantity: item.quantity };
      }).filter(p => p);
      this.total = this.produits.reduce((s, p) => s + (p.price * p.quantity), 0);
    });
  }

  augmenterQuantite(id: number) {
    const currentQuantity = this.panierService.obtenirQuantite(id);
    this.panierService.modifierQuantite(id, currentQuantity + 1);
    this.chargerProduits();
  }

  diminuerQuantite(id: number) {
    const currentQuantity = this.panierService.obtenirQuantite(id);
    if (currentQuantity > 1) {
      this.panierService.modifierQuantite(id, currentQuantity - 1);
      this.chargerProduits();
    }
  }

  retirerDuPanier(id: number) {
    this.panierService.retirerProduit(id);
    this.chargerProduits();
  }

  commander() {
    const itemsWithPrices = this.produits.map(p => ({
      productId: p.id,
      quantity: p.quantity,
      price: p.price
    }));
    
    // Stocker directement les infos dans localStorage sans enregistrer en BDD
    this.panierService.setPaiementInfos('', this.total, {}, itemsWithPrices);
    this.router.navigate(['/paiement']);
  }
}
