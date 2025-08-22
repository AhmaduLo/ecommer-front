import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderResponse, OrderItem } from 'src/app/model/panier';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private apiUrl = 'http://localhost:8080/api/orders';
  private panierKey = 'panier_produits';

  accessToken: string = '';
  totalPrice: number = 0;

  constructor(private http: HttpClient) { }

  getProduits(): number[] {
    const items = this.getItems();
    return items.map(item => item.productId);
  }

  getItems(): OrderItem[] {
    return JSON.parse(localStorage.getItem(this.panierKey) || '[]');
  }

  ajouterProduit(id: number, quantity: number = 1) {
    const items = this.getItems();
    const existingItem = items.find(item => item.productId === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ productId: id, quantity: quantity });
    }

    localStorage.setItem(this.panierKey, JSON.stringify(items));
  }

  modifierQuantite(id: number, quantity: number) {
    const items = this.getItems();
    const item = items.find(item => item.productId === id);

    if (item) {
      if (quantity <= 0) {
        this.retirerProduit(id);
      } else {
        item.quantity = quantity;
        localStorage.setItem(this.panierKey, JSON.stringify(items));
      }
    }
  }

  retirerProduit(id: number) {
    let items = this.getItems().filter(item => item.productId !== id);
    localStorage.setItem(this.panierKey, JSON.stringify(items));
  }

  obtenirQuantite(id: number): number {
    const items = this.getItems();
    const item = items.find(item => item.productId === id);
    return item ? item.quantity : 0;
  }

  getNombreArticles(): number {
    const items = this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  viderPanier() {
    localStorage.removeItem(this.panierKey);
  }

  envoyerCommande(order: Order) {
    return this.http.post<OrderResponse>(this.apiUrl, order);
  }

 setPaiementInfos(token: string, montant: number) {
  this.accessToken = token;
  this.totalPrice = montant;
  localStorage.setItem('paiement', JSON.stringify({ accessToken: token, totalPrice: montant }));
}


  getPaiementInfos() {
  const data = localStorage.getItem('paiement');
  if (!data) return { accessToken: '', totalPrice: 0 };
  return JSON.parse(data);
}


  createPaiementSession(accessToken: string, amount: number): Observable<any> {
  return this.http.post<any>('http://localhost:8080/api/payment/create', {
    accessToken,
    amount: Math.round(amount * 100)  // Stripe attend les centimes
  });
}
}
