import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { DappsService } from '../../../../../dapps.service';
import { Dapp } from '../../../../../dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-category-type',
  templateUrl: './category-type.page.html',
  styleUrls: ['./category-type.page.scss'],
})
export class CategoryTypePage implements OnInit {

  dapps: Dapp[] = [];
  dapp: string = '';
  categories: any[];
  categoryType: string = '';
  appsLoaded: boolean = true;

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 4,
  };

  constructor(
    private dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    this.categories = this.dappsService.categories;
    this.slideOpts.initialSlide = this.dappsService.index;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('categoryType')) {
        this.navCtrl.navigateBack('/store/tabs/categories');
        return;
      }
      this.dapps = this.dappsService.getCategory(paramMap.get('categoryType'));
      this.categoryType = paramMap.get('categoryType');
      console.log('category', this.categoryType);
    });
  }

  changeCat(cat) {
    this.categoryType = cat;
    this.dapps = this.dappsService.getCategory(cat);
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // Search
  filterDapps(search: string) {
    this.appsLoaded = false;
    this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      this.dapps = apps.filter(app => app.category === this.categoryType);
      console.log('Search reults', this.dapps);
      if (search.length === 0) {
        this.dapps = this.dapps
        console.log('Search is empty', this.dapps);
      }
      if (this.categoryType === 'new') {
        this.dapps = apps;
      }
      if (this.categoryType === 'popular') {
        this.dapps = apps;
      }
    });
  }

  // Install app
  async installApp(dapp) {
    dapp.installing = true;

    // Download the file
    const epkPath = await this.downloadAppEPK(dapp);
    console.log("EPK file downloaded and saved to " + epkPath);

    // Ask the app installer to install the DApp
    appManager.sendIntent(
      'appinstall',
      { url: epkPath, dappStoreServerAppId: dapp._id },
      () => {
        console.log('App installed');
        dapp.installing = false;
        dapp.installed = true;
      }, (err) => {
        console.log('App install failed', err)
        dapp.installing = false;
      }
    );
  }

  async downloadAppEPK(dapp) {
    return await this.dappsService.downloadDapp(dapp);
  }

  closeApp() {
    appManager.close();
  }
}
