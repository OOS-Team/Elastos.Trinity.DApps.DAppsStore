import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StorePage } from './store.page';

const routes: Routes = [
  {
    path: 'tabs', // Bottom Tab Navigation
    component: StorePage,
    children: [
      // 1st Tab
      {
        path: 'dapps',
        children: [
          {
            path: '',
            loadChildren: './main/dapps/dapps.module#DappsPageModule'
          },
          {
            path: ':dappId',
            loadChildren: './main/dapps/dapp-detail/dapp-detail.module#DappDetailPageModule'
          }
        ]
      },
      // 2nd Tab
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadChildren: './main/categories/categories.module#CategoriesPageModule'
          },
          {
            path: ':categoryType',
            loadChildren: './main/categories/category-type/category-type.module#CategoryTypePageModule'
          }
        ]
      },
      // 3rd Tab
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: './main/search/search.module#SearchPageModule'
          },
        ]
      },
       //  Default Tab
      {
        path: '',
        redirectTo: '/store/tabs/dapps',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/store/tabs/dapps',
    pathMatch: 'full'
  },
  { path: 'categories', loadChildren: './main/categories/categories.module#CategoriesPageModule' },
  { path: 'category-type', loadChildren: './main/categories/category-type/category-type.module#CategoryTypePageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StoreRoutingModule {}
