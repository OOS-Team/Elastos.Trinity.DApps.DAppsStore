import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DappsService } from 'src/app/services/dapps.service';
import { Dapp } from 'src/app/models/dapps.model';
import { Category } from 'src/app/models/categories.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  applications: Dapp[] = [];
  categories: Category[] = [];
  appsLoaded: boolean = false;

  constructor(
    private dappsService: DappsService,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.appsLoaded = true;
    this.applications = this.dappsService.dapps;

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
      });
    }
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
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

  //// Install app if not installed ////
  installApp(dapp: Dapp) {
    dapp.installing = true;
    this.dappsService.installApp(dapp).then(res => {
      console.log('Install state', res)
      dapp.installing = false;
      if(res === true) {
        dapp.installed = true;
        dapp.updateAvailable = false;
        this.installSuccess(dapp);
      } else {
        this.installFailed(dapp);
      }
    });
  }

  //// Open app if installed ////
  startApp(id: string) {
    this.dappsService.startApp(id);
  }

  //// Alerts ////
  async installSuccess(dapp: Dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Installed ' + dapp.appName + ' ' + dapp.versionName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async installFailed(dapp: Dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Failed to install ' + dapp.appName + ' ' + dapp.versionName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }
}
