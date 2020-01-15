import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DappsService } from 'src/app/services/dapps.service';
import { Dapp } from 'src/app/models/dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.page.html',
  styleUrls: ['./my-apps.page.scss'],
})
export class MyAppsPage implements OnInit {

  dapps: Dapp[] = [];
  filteredApps: Dapp[] = [];
  dapp: string = '';

  constructor(
    private dappsService: DappsService,
    public toastController: ToastController
  ) {}

  /* This page is currently not working due to the modified package name, hence appInfos is not permitted */
  ngOnInit() {
    this.dapps = this.dappsService.dapps.filter(dapp => dapp.installed === true)
    this.filteredApps = this.dapps;
    console.log('My DApps' + this.dapps);
  }

  ionViewWillEnter() {
    this.dapps = this.dappsService.dapps.filter(dapp => dapp.installed === true)
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  //// Search ////
  filterDapps(search: string) {
    this.filteredApps = this.dapps.filter((dapp) => {
      return dapp.appName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
  }

   //// Install app if update is available  ////
   installApp(dapp: Dapp) {
    dapp.installing = true;
    this.dappsService.installApp(dapp).then(res => {
      console.log('Install state', res)
      dapp.installing = false;
      if(res === true) {
        dapp.installed = true;
        dapp.updateAvailable = false;
        this.updateSuccess(dapp);
      } else {
        dapp.installed = false;
        this.updateFailed(dapp);
      }
    });
  }

  //// Open app if installed ////
  startApp(id: string) {
    this.dappsService.startApp(id);
  }

  //// Alerts ////
  async updateSuccess(dapp: Dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: dapp.appName + ' updated to ' + dapp.versionName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async updateFailed(dapp: Dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: dapp.appName + ' update failed',
      color: "primary",
      duration: 2000
    });
    toast.present();
  }
}
