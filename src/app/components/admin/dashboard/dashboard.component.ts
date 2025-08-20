import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/Product';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-dashboard',
  template: `
   <div class="dashboard">
  <h2>Ajouter un produit</h2>

 <form [formGroup]="productForm" (ngSubmit)="submitForm()">
  <label for="name">Nom du produit</label>
  <input id="name" formControlName="name" placeholder="Nom du produit" />

  <label for="description">Description</label>
  <textarea id="description" formControlName="description" placeholder="Description"></textarea>

  <label for="price">Prix (€)</label>
  <input id="price" type="number" formControlName="price" placeholder="Prix (€)" />

  <label for="stock">Stock</label>
  <input id="stock" type="number" formControlName="stock" placeholder="Stock" />

  <label for="category">Catégorie</label>
  <input id="category" formControlName="category" placeholder="Catégorie" />

  <label for="seoTitle">Titre SEO</label>
  <input id="seoTitle" formControlName="seoTitle" placeholder="Titre SEO" />

  <label for="shortDescription">Description courte</label>
  <input id="shortDescription" formControlName="shortDescription" placeholder="Description courte" />

  <label for="slug">Slug URL</label>
  <input id="slug" formControlName="slug" placeholder="Slug URL" />

  <div formArrayName="imageUrls">
    <label>Images</label>
    <div *ngFor="let control of imageUrls.controls; let i = index">
      <input [formControlName]="i" [id]="'image' + i" [placeholder]="'URL image ' + (i + 1)" />
      <button type="button" (click)="removeImageField(i)">Supprimer</button>
    </div>
    <button type="button" (click)="addImageField()">Ajouter une image</button>
  </div>

  <button type="submit">Envoyer</button>
</form>

  <p>{{ message }}</p>
</div>


<div class="btn-product">
  <button (click)="viewAllProducts()">Voir tous les produits</button>
</div>

  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  productForm: FormGroup;
  message: string = '';


  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      category: ['', Validators.required],
      seoTitle: ['', Validators.required],
      shortDescription: ['', Validators.required],
      slug: ['', Validators.required],
      imageUrls: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });
  }

  get imageUrls(): FormArray {
    return this.productForm.get('imageUrls') as FormArray;
  }

  addImageField() {
    this.imageUrls.push(this.fb.control('', Validators.required));
  }

  removeImageField(index: number) {
    if (this.imageUrls.length > 1) {
      this.imageUrls.removeAt(index);
    }
  }

  submitForm() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      this.productService.addProduct(product).subscribe({
        next: () => {
          this.message = 'Produit ajouté avec succès';
          this.productForm.reset();
          this.imageUrls.clear();
          this.imageUrls.push(this.fb.control('', Validators.required));
        },
        error: (err: any) => {
          this.message = 'Erreur lors de l’ajout du produit';
          console.error(err);
        }
      });
    } else {
      this.message = 'Formulaire invalide';
    }
  }

  viewAllProducts() {
    this.router.navigate(['/admin/allProducts']);
  }
}
