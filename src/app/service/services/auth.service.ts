import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from 'src/app/model/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/api/admin';

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.getToken() !== null);

  constructor(private readonly http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {

    const loginRequest: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap((response: LoginResponse) => {
          if (response?.token) {
            this.setToken(response.token);
          } else {
            throw new Error('Token manquant dans la réponse');
          }

          if (response?.message) {
            console.log('Message du serveur:', response.message);
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getIsLoggedIn(): Observable<boolean> {
  return this.isLoggedInSubject.asObservable();
}
}
