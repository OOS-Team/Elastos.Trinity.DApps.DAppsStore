import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { StorePageModule } from './pages/store/store.module';
import { AboutPageModule } from './pages/about/about.module';
import { MyAppsPageModule } from './pages/my-apps/my-apps.module';

const routes: Routes = [
  { path: '', redirectTo: 'store', pathMatch: 'full' },
  { path: 'store', loadChildren: () => StorePageModule },
  { path: 'my-apps', loadChildren: () => MyAppsPageModule },
  { path: 'about', loadChildren: () => AboutPageModule },
];

@NgModule({
  imports: [
    StorePageModule,
    AboutPageModule,
    MyAppsPageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
