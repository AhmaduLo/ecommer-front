import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/Product';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-all-products',
   template: `
  <section class="product-list-container">
  <h2>Gestion des produits</h2>
  <div class="products">
    <div class="product-card" *ngFor="let product of products">
      <img [src]="product.images?.[0]?.imageUrl || 'assets/images/placeholder.jpg'" [alt]="product.name" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency: 'EUR' }}</p>
      <div class="actions">
        <button class="update" (click)="updateProduct(product.id)">Modifier</button>
        <button class="delete" (click)="deleteProduct(product.id)">Supprimer</button>
      </div>
    </div>
  </div>
</section>

  `,
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent {

 products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Erreur chargement produits', err)
    });
  }

  deleteProduct(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  updateProduct(id: number) {
    this.router.navigate(['/admin/update-product', id]);
  }
}
