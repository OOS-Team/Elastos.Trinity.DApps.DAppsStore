import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicImageLoader } from 'ionic-image-loader';

import { CategoryTypePage } from './category-type.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: CategoryTypePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryTypePage]
})
export class CategoryTypePageModule {}
