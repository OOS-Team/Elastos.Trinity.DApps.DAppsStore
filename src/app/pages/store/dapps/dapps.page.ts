import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DappsService } from '../../../services/dapps.service';
import { Dapp } from '../../../models/dapps.model';


@Component({
  selector: 'app-dapps',
  templateUrl: './dapps.page.html',
  styleUrls: ['dapps.page.scss'],
})
export class DappsPage implements OnInit {

  // General
  applications: Dapp[] = [];
  categories: any[];
  dapp: string = '';
  appsLoaded: boolean = false;

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 4,
  };

  constructor(
    public dappsService: DappsService,
    public toastController: ToastController,
  ) {}

  ngOnInit() {
    this.appsLoaded = true;
    this.applications = this.dappsService.dapps;
    this.categories = this.dappsService.categories;

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

  //// Search ////
  filterDapps(search: string) {
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.applications = this.dappsService.dapps;
    } else {
      this.applications = [];
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        this.appsLoaded = true;
        this.dappsService.dapps.map(dapp => {
          apps.map(app => {
            if(dapp.packageName === app.packageName) {
              this.applications = this.applications.concat(dapp);
            }
          });
        });
      });
    }
  }

  //// Filter apps for each category ////
  getApps(cat: string) {
    if (cat === 'new') {
      return this.dappsService.dapps;
    }
    if (cat === 'popular') {
      return this.applications.sort((a, b) => {
        return b.downloadsCount - a.downloadsCount;
      });
    } else {
      return this.applications.filter(app => app.category === cat);
    }
  }

  //// Set initial category button in category-type page ////
  showCategory(index: number) {
    this.dappsService.setCatIndex(index);
  }

  //// Install app if app is not installed or update is available ////
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
      duration: 2000,
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
