import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from 'ionic-image-loader';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    RouterModule.forChild(routes)
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
