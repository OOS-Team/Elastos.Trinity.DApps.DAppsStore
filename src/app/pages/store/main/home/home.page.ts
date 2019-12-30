import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { Dapp } from 'src/app/dapps.model';
import { DappsService } from 'src/app/dapps.service';

declare let appManager: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  applications: Dapp[] = [];
  appsLoaded: boolean = false;

  constructor(
    private dappsService: DappsService,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.appsLoaded = false;
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      this.applications = apps;
    });
  }

  ionViewWillEnter() {
    this.applications = this.dappsService.dapps;
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // Install app
  installApp(dapp) {
    dapp.installing = true;
    this.dappsService.installApp(dapp).then(res => {
      console.log('Install state', res)
      dapp.installing = false;
      if(res === true) {
        dapp.installed = true;
        dapp.updateAvailable = false;
        this.installSuccess(dapp);
      } else {
        dapp.installed = false;
        this.installFailed(dapp);
      }
    });
  }

  async installSuccess(dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Installed ' + dapp.appName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async installFailed(dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Failed to install ' + dapp.appName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  startApp(id) {
    this.dappsService.startApp(id);
  }
}
