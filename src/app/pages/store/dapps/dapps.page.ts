import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DappsService } from '../../../services/dapps.service';
import { Dapp } from '../../../models/dapps.model';
import { TranslateService } from '@ngx-translate/core';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

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
    public translate: TranslateService
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

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant("capsules"));
    this.dappsService.setTitleBarBackKeyShown(true);
  }

  ionViewWillLeave() {
    this.dappsService.setTitleBarBackKeyShown(false);
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
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        this.appsLoaded = true;
        this.applications = apps;
      });
    }
  }

  //// Filter apps for each category ////
  getApps(cat: string) {
    if (cat === 'new') {
      return this.applications.filter((dapp) => dapp.category !== 'techdemo');
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
}
