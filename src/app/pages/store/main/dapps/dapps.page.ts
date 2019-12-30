import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

declare let appManager: any;

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
    private dappsService: DappsService,
    public toastController: ToastController,
  ) {}

  ngOnInit() {
    this.appsLoaded = false;
    this.categories = this.dappsService.categories;
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      console.log("DApps fetched", apps);
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

  // Search
  filterDapps(search: string) {
    this.appsLoaded = false;
    this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      this.applications = apps;
    });
    if (search.length === 0) {
      this.applications = this.applications;
    }
  }

  // Filter apps for each category
  getApps(cat) {
    if (cat === 'new') {
      return this.applications;
    }
    if (cat === 'popular') {
      return this.applications.sort((a, b) => {
        return b.downloadsCount - a.downloadsCount;
      });
    } else {
      return this.applications.filter(app => app.category === cat);
    }
  }

  // Set initial category button in category-type page
  showCategory(index) {
    this.dappsService.setCatIndex(index);
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
      mode: 'ios',
      message: 'Installed ' + dapp.appName,
      color: "primary",
      duration: 2000,
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
}
