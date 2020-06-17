import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from 'ionic-image-loader';

import { IonicModule } from '@ionic/angular';

import { DappDetailPage } from './dapp-detail.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: DappDetailPage
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
  declarations: [DappDetailPage]
})
export class DappDetailPageModule {}
