import { Component } from "@angular/core";
import { Product } from "src/app/model/Product";
import { ProductService } from "src/app/service/product/product.service";
import { Router } from '@angular/router';
import { PanierService } from "src/app/service/panier/panier.service";
import { ModalService } from "src/app/service/modal/modal.service";

@Component({
  selector: "app-accueil",
  template: `
  <section class="accueilContainer">
  <div class="welcome">
    <h1>Bienvenue sur notre site de vente en ligne !</h1>
    <p>Découvrez nos produits et profitez de nos offres exclusives.</p>
  </div>

  <div class="featuredProducts">
    <div class="product-list">
      <div class="product-item" *ngFor="let product of products">
        <div class="image">
          <img
            [src]="product.images?.[0]?.imageUrl || 'assets/images/placeholder.jpg'"
            [alt]="product.name"
          />
        </div>
        <h3>{{ product.name }}</h3>
        <p>{{ product.price | currency: 'EUR' }}</p>
        <div class="btn">
          <button (click)="ajouterAuPanier(product.id)">Ajouter au panier</button>
          <button (click)="openModal(product)">Détails</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal" *ngIf="selectedProduct" (click)="closeModal($event)">
    <div class="modal-content">
      <span class="close" (click)="closeModal($event)">&times;</span>
      <div class="product-details">
        <div class="image-carousel">
          <button class="prev" (click)="prevImage($event)">&lt;</button>
          <div class="images">
            <img
              [src]="selectedProduct.images?.[currentImageIndex]?.imageUrl || 'assets/images/placeholder.jpg'"
              [alt]="selectedProduct.name"
            />
          </div>
          <button class="next" (click)="nextImage($event)">&gt;</button>
        </div>
        <h2>{{ selectedProduct.name }}</h2>
        <p class="price">{{ selectedProduct.price | currency: "EUR" }}</p>
        <p class="description">{{ selectedProduct.description }}</p>
        <p class="stock">Stock disponible: {{ selectedProduct.stock }}</p>
        <button
          (click)="ajouterAuPanier(selectedProduct.id)"
          [disabled]="selectedProduct.stock === 0"
        >
          {{
            selectedProduct.stock > 0
              ? "Ajouter au panier"
              : "Rupture de stock"
          }}
        </button>
      </div>
    </div>
  </div>

</section>
<app-modal></app-modal>
  `,
  styleUrls: ["./accueil.component.scss"],
})
export class AccueilComponent {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  currentImageIndex = 0;

  constructor(
    private readonly productService: ProductService, 
    private readonly Router: Router, 
    private readonly panierService: PanierService,
    private readonly modalService: ModalService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      (error: any) => {
        console.error("Erreur lors du chargement des produits:", error);
      }
    );
  }

  openModal(product: Product) {
    this.selectedProduct = product;
    this.currentImageIndex = 0;
  }

  closeModal(event: MouseEvent) {
    if (
      event.target instanceof Element &&
      (event.target.classList.contains("modal") ||
        event.target.classList.contains("close"))
    ) {
      this.selectedProduct = null;
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.selectedProduct && this.selectedProduct.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.selectedProduct.images.length) %
        this.selectedProduct.images.length;
    }
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.selectedProduct && this.selectedProduct.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.selectedProduct.images.length;
    }
  }

  ajouterAuPanier(produitId: number) {
    this.panierService.ajouterProduit(produitId);
    this.modalService.showSuccess('Produit ajouté au panier 🛒 !');
  }
}