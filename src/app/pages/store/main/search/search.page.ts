import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', {static: false}) search: IonInput;

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

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 200);
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
      this.filteredApps = [];
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        console.log('Searched apps', apps);
        this.appsLoaded = true;
        this.dapps.map(dapp => {
          apps.map(app => {
            if(dapp.packageName === app.packageName) {
              this.filteredApps = this.filteredApps.concat(dapp);
            }
          })
        })
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
        dapp.updateAvailable = false;
        this.installSuccess(dapp);
      } else {
        this.installFailed(dapp);
      }
    });
  }

  async installSuccess(dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Installed ' + dapp.appName + ' ' + dapp.versionName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  async installFailed(dapp) {
    const toast = await this.toastController.create({
      mode: 'ios',
      message: 'Failed to install ' + dapp.appName + ' ' + dapp.versionName,
      color: "primary",
      duration: 2000
    });
    toast.present();
  }

  startApp(id) {
    this.dappsService.startApp(id);
  }
}
