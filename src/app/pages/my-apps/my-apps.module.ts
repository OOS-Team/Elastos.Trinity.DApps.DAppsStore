import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from 'ionic-image-loader';

import { IonicModule } from '@ionic/angular';

import { MyAppsPage } from './my-apps.page';

const routes: Routes = [
  {
    path: '',
    component: MyAppsPage
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
  declarations: [MyAppsPage]
})
export class MyAppsPageModule {}
