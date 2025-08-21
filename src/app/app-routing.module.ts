import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './components/users/accueil/accueil.component';
import { LoginComponent } from './components/admin/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AllProductsComponent } from './components/admin/all-products/all-products.component';
import { PanierComponent } from './components/users/panier/panier.component';


const routes: Routes = [
  {
    path: '',
    component: AccueilComponent
  },
   {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'panier',
    component: PanierComponent
  },
  { 
    path: 'admin/dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin/allProducts', 
    component: AllProductsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
