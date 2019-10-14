import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: 'store', loadChildren: './pages/store/store.module#StorePageModule' },
  { path: 'my-apps', loadChildren: './pages/my-apps/my-apps.module#MyAppsPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
