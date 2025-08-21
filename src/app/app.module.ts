import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { AccueilComponent } from './components/users/accueil/accueil.component';
import { HeaderComponent } from './components/header/components/header/header.component';
import { LoginComponent } from './components/admin/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AuthInterceptor } from './guards/auth.interceptor';
import { AllProductsComponent } from './components/admin/all-products/all-products.component';
import { PanierComponent } from './components/users/panier/panier.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    AccueilComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    AllProductsComponent,
    PanierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     HttpClientModule,
     FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
