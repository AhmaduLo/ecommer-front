import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/model/Product";
import { ProductService } from "src/app/service/product/product.service";

@Component({
  selector: "app-all-products",
  template: `
    <section class="product-list-container">
      <h2>Gestion des produits</h2>
      <div class="products">
        <div class="product-card" *ngFor="let product of products">
          <img
            [src]="product.images?.[0]?.imageUrl || 'assets/images/placeholder.jpg'"
            [alt]="product.name"
          />
          <h3>{{ product.name }}</h3>
          <p>{{ product.price | currency: "EUR" }}</p>
          <div class="actions">
            <button class="update" (click)="openEditModal(product)">
              Modifier
            </button>
            <button class="delete" (click)="deleteProduct(product.id)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <div class="modal-backdrop" *ngIf="showEditModal">
      <div class="modal">
        <h2>Modifier le produit</h2>
        <form #editForm="ngForm" (ngSubmit)="submitEdit()">
          <label>Nom</label>
          <input [(ngModel)]="selectedProduct!.name" name="name" required />

          <label>Description</label>
          <textarea
            [(ngModel)]="selectedProduct!.description"
            name="description"
            required
          ></textarea>

          <label>Prix</label>
          <input
            type="number"
            [(ngModel)]="selectedProduct!.price"
            name="price"
            required
          />

          <label>Stock</label>
          <input
            type="number"
            [(ngModel)]="selectedProduct!.stock"
            name="stock"
            required
          />

          <label>Catégorie</label>
          <input
            [(ngModel)]="selectedProduct!.category"
            name="category"
            required
          />

          <label>Slug</label>
          <input [(ngModel)]="selectedProduct!.slug" name="slug" />

          
            <label>Images</label>
            <div *ngFor="let url of selectedProduct?.imageUrls; let i = index">
              <input
                [(ngModel)]="selectedProduct!.imageUrls[i]"
                name="image{{ i }}"
                placeholder="URL de l'image {{ i + 1 }}"
              />
              <button type="button" (click)="removeImage(i)">Supprimer</button>
            </div>
            <button type="button" (click)="addImage()">
              Ajouter une image
            </button>
          
          <!-- Tu peux rajouter d'autres champs ici si tu veux -->

          <button type="submit">Enregistrer</button>
          <button type="button" (click)="closeEditModal()">Annuler</button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ["./all-products.component.scss"],
})
export class AllProductsComponent {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  showEditModal: boolean = false;

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error("Erreur chargement produits", err),
    });
  }

  deleteProduct(id: number) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== id);
        },
        error: (err) => console.error("Erreur suppression", err),
      });
    }
  }

  submitEdit() {
    if (this.selectedProduct) {
      if (!this.selectedProduct.imageUrls) {
        this.selectedProduct.imageUrls = [];
      }

      this.productService
        .updateProduct(this.selectedProduct.id, this.selectedProduct)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeEditModal();
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour :", err);
          },
        });
    }
  }

  addImage() {
    if (this.selectedProduct?.imageUrls) {
      this.selectedProduct.imageUrls.push("");
    }
  }

  removeImage(index: number) {
    if (this.selectedProduct) {
      this.selectedProduct.imageUrls.splice(index, 1);
    }
  }

  openEditModal(product: Product) {
    this.selectedProduct = {
      ...product,
      imageUrls: product.images?.map(img => img.imageUrl) || []
    };

    this.showEditModal = true;
  }
  closeEditModal() {
    this.selectedProduct = null;
    this.showEditModal = false;
  }
}
