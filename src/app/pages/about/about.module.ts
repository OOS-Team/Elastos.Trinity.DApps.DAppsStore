import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AboutPage } from './about.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPage
  }
]; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AboutPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA] // Needed to find ion-back-button, etc
})
export class AboutPageModule {}
