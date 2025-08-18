import { Component, Inject } from '@angular/core';
import { Product } from 'src/app/model/Product';
import { ProductService } from 'src/app/service/product-service.service';

@Component({
  selector: 'app-accueil',
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
            <img [src]="product.imageUrls[0]" [alt]="product.name"> 
            </div> <!-- Correction ici -->
            <h3>{{ product.name }}</h3>
            <p>{{ product.price | currency:'EUR' }}</p>
            <div class="btn">
              <button (click)="addToCart(product)">Ajouter au panier</button>
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
            <div class="image-carousel">  <!-- Ajout du carrousel -->
              <button class="prev" (click)="prevImage($event)">&lt;</button>
              <img [src]="selectedProduct.imageUrls[currentImageIndex]" [alt]="selectedProduct.name">
              <button class="next" (click)="nextImage($event)">&gt;</button>
            </div>
            <h2>{{ selectedProduct.name }}</h2>
            <p class="price">{{ selectedProduct.price | currency:'EUR' }}</p>
            <p class="description">{{ selectedProduct.description }}</p>
            <p class="stock">Stock disponible: {{ selectedProduct.stock }}</p>
            <button (click)="addToCart(selectedProduct)" [disabled]="selectedProduct.stock === 0">
              {{ selectedProduct.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock' }}
            </button>
          </div>
        </div>
      </div>
    </section>
   
  `,
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
 products: Product[] = [];
  selectedProduct: Product | null = null;
   currentImageIndex = 0;

  constructor(@Inject(ProductService) private readonly productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (      products: Product[]) => this.products = products,
      (      error: any) => console.error('Erreur lors du chargement des produits:', error)
    );
  }

    prevImage(event: Event) {
    event.stopPropagation();
    if (this.selectedProduct) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.selectedProduct.imageUrls.length) % this.selectedProduct.imageUrls.length;
    }
  }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.selectedProduct) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedProduct.imageUrls.length;
    }
  }

  openModal(product: Product) {
    this.selectedProduct = product;
  }

  closeModal(event: MouseEvent) {
    if (
      event.target instanceof Element && 
      (event.target.classList.contains('modal') || 
       event.target.classList.contains('close'))
    ) {
      this.selectedProduct = null;
    }
  }

  addToCart(product: Product) {
    // TODO: Implémenter la logique du panier
    console.log('Produit ajouté au panier:', product);
  }

}
