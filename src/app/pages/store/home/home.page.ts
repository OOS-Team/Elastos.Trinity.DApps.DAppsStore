import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DappsService } from 'src/app/services/dapps.service';
import { Dapp } from 'src/app/models/dapps.model';
import { Category } from 'src/app/models/categories.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  applications: Dapp[] = [];
  categories: Category[] = [];
  randomDapp: Dapp;
  appsLoaded: boolean = false;

  constructor(
    public dappsService: DappsService,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.appsLoaded = true;
    this.applications = this.dappsService.dapps;
    this.getRandomApp();

    this.dappsService.categories.map(cat => {
      this.categories.push({
        name: cat,
        appCount: null
      });
    });

    if(this.applications.length === 0) {
      this.appsLoaded = false;
      this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
        console.log("DApps fetched", apps);
        this.appsLoaded = true;
        this.applications = apps;
        this.getRandomApp();
      });
    }
  }

  ionViewDidEnter() {
    appManager.setVisible("show");

    titleBarManager.setTitle("Capsule Marketplace");
    titleBarManager.setBackgroundColor("#FFFFFF");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.DARK);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  getRandomApp() {
    this.randomDapp = this.applications[Math.floor(Math.random() * this.applications.length)];
    console.log('App showcase', this.randomDapp);
  }

  //// Organize categories by the most apps ////
  getTopCats() {
    this.applications.map(app => {
      this.categories.map(cat => {
        if(app.category === cat.name) {
          cat.appCount++;
        }
      })
    })
    return this.categories.sort((cat1, cat2) => {
      return cat2.appCount - cat1.appCount;
    });
  }
}
