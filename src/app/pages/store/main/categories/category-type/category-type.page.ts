import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

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
    public toastController: ToastController
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
