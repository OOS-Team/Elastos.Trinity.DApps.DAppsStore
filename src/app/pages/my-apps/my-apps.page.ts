import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DappsService } from 'src/app/dapps.service';
import { Dapp } from 'src/app/dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.page.html',
  styleUrls: ['./my-apps.page.scss'],
})
export class MyAppsPage implements OnInit {

  // General
  dapps: Dapp[] = [];
  filteredApps: Dapp[] = [];
  dapp: string = '';

  constructor(
    private dappsService: DappsService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.dapps = this.dappsService.dapps.filter(dapp => dapp.installed === true)
    this.filteredApps = this.dapps;
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // Search
  filterDapps(search): any {
    this.filteredApps = this.dapps.filter((dapp) => {
      return dapp.appName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
  }

   // Install app
   installApp(dapp) {
    dapp.installing = true;
    this.dappsService.installApp(dapp).then(res => {
      console.log('Install state', res)
      dapp.installing = false;
      if(res === true) {
        dapp.installed = true;
        this.updateSuccess(dapp);
      } else {
        dapp.installed = false;
        this.updateFailed(dapp);
      }
    });
  }

  async updateSuccess(dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: dapp.appName + 'updated',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async updateFailed(dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: dapp.appName + 'update failed',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }
}
