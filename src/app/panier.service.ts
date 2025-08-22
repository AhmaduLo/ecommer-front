import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  createPaiementSession(accessToken: string, amount: number): Observable<{clientSecret: string}> {
    const payload = {
      accessToken: accessToken,
      amount: amount
    };
    return this.http.post<{clientSecret: string}>(`${this.apiUrl}/payment/create`, payload);
  }

  confirmerCommande(paymentIntentId: string, accessToken: string): Observable<any> {
    const payload = {
      paymentIntentId: paymentIntentId,
      accessToken: accessToken
    };
    return this.http.post(`${this.apiUrl}/orders/confirm`, payload);
  }

  getPaiementInfos(): any {
    const infos = localStorage.getItem('paiement');
    return infos ? JSON.parse(infos) : null;
  }
}
