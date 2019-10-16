import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { StorePage } from './store.page';
import { StoreRoutingModule } from './store-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    StoreRoutingModule
  ],
  declarations: [
    StorePage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Needed to find ion-back-button, etc
})
export class StorePageModule {}
