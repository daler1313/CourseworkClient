import { Routes } from '@angular/router';
import { NavbarAdminComponent } from './pages/navbar-admin/navbar-admin.component';
import { ProductComponent } from './pages/product/product.component';
import { CategoryComponent } from './pages/category/category.component';

export const routes: Routes = [ 
  {
    path: '',
    redirectTo: 'categories', // Исправлено: 'categorys' → 'categories'
    pathMatch: 'full'
  },
  {
    path: '',
    component: NavbarAdminComponent,
    children: [
      { path: 'product', component: ProductComponent },
      { path: 'categories', component: CategoryComponent } // Исправлено: 'categorys' → 'categories'
    ]
  }
];
