import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { DappsService } from '../../../../../services/dapps.service';
import { Dapp } from '../../../../../models/dapps.model';


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

  //// Change category tab ////
  changeCat(cat: string) {
    this.categoryType = cat;
    this.dapps = this.dappsService.getCategory(cat);
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  //// Search ////
  filterDapps(search: string) {
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.dapps = this.dappsService.getCategory(this.categoryType);
    } else {
      this.dapps = [];
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        this.appsLoaded = true;
        let searchedApps = [];
        this.dappsService.dapps.map(dapp => {
          apps.map(app => {
            if(dapp.packageName === app.packageName) {
              searchedApps = searchedApps.concat(dapp);
              this.dapps = searchedApps.filter(app => app.category === this.categoryType);
              if (this.categoryType === 'new') {
                this.dapps = searchedApps;
              }
              if (this.categoryType === 'popular') {
                this.dapps = searchedApps;
              }
            }
          });
        });
      });
    }
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
      duration: 2000
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
