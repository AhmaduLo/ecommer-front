import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, OrderResponse } from 'src/app/model/panier';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

 private apiUrl = 'http://localhost:8080/api/orders';
  private panierKey = 'panier_produits';

  constructor(private http: HttpClient) {}

  getProduits(): number[] {
    return JSON.parse(localStorage.getItem(this.panierKey) || '[]');
  }

  ajouterProduit(id: number) {
    const produits = this.getProduits();
    produits.push(id);
    localStorage.setItem(this.panierKey, JSON.stringify(produits));
  }

  retirerProduit(id: number) {
    let produits = this.getProduits().filter(pid => pid !== id);
    localStorage.setItem(this.panierKey, JSON.stringify(produits));
  }

  viderPanier() {
    localStorage.removeItem(this.panierKey);
  }

  envoyerCommande(order: Order) {
    return this.http.post<OrderResponse>(this.apiUrl, order);
  }
}
