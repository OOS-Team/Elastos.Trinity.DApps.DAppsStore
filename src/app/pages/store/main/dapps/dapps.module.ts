import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DappsPage } from './dapps.page';

const routes: Routes = [
  {
    path: '',
    component: DappsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DappsPage
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA] // Needed to find ion-back-button, etc
})
export class DappsPageModule {}
