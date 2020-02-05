import { Component, OnInit } from '@angular/core';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});
  }
}
