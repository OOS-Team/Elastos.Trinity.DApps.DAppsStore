import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { StorePageModule } from './pages/store/store.module';
import { AboutPageModule } from './pages/about/about.module';

const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: 'store', loadChildren: () => StorePageModule },
  { path: 'about', loadChildren: () => AboutPageModule },
 // { path: 'my-apps', loadChildren: './pages/my-apps/my-apps.module#MyAppsPageModule' },
];

@NgModule({
  imports: [
    StorePageModule,
    AboutPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
