import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  // General
  dapps: Dapp[] = [];
  filteredApps: Dapp[] = [];
  dapp: string = '';
  appsLoaded: boolean = false;

  constructor(
    private dappsService: DappsService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.appsLoaded = false;
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      console.log("DApps fetched", apps);
      this.appsLoaded = true;
      this.dapps = apps;
    });
  }

  ionViewWillEnter() {
    this.dapps = this.dappsService.dapps;
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // Search
  filterDapps(search) {
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.filteredApps = [];
    } else {
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        this.appsLoaded = true;
        this.filteredApps = apps;
      });
    }
  }

  // Install app
  installApp(dapp) {
    dapp.installing = true;
    this.dappsService.installApp(dapp).then(res => {
      console.log('Install state', res)
      dapp.installing = false;
      if(res === true) {
        dapp.installed = true;
        this.installSuccess(dapp);
      } else {
        dapp.installed = false;
        this.installFailed(dapp);
      }
    });
  }

  async installSuccess(dapp) {
    const toast = await this.toastController.create({
      message: 'Installed ' + dapp.appName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async installFailed(dapp) {
    const toast = await this.toastController.create({
      message: 'Failed to install ' + dapp.appName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }
}
