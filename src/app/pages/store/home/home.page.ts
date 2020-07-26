import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

import { DappsService } from 'src/app/services/dapps.service';
import { Dapp } from 'src/app/models/dapps.model';
import { Category } from 'src/app/models/categories.model';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  dapps: Dapp[] = [];
  topCategoriesByAppCount: Category[] = [];
  showcaseDapp: Dapp;

  appsLoaded: boolean = false;
  onItemClickedListener: any;

  constructor(
    public dappsService: DappsService,
    public translate: TranslateService,
    public toastController: ToastController,
    private alertController: AlertController,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.appsLoaded = true;
    this.dapps = this.dappsService.dapps;
    this.getRandomApp();

    this.dappsService.categories.forEach(cat => {
      this.topCategoriesByAppCount.push({
        name: cat,
        appCount: null
      });
    });

    if(this.dapps.length === 0) {
      this.appsLoaded = false;
      this.dappsService.fetchDapps().subscribe((fetchedApps: Dapp[]) => {
        console.log("Apps fetched from home page", fetchedApps);
        this.appsLoaded = true;
        this.dapps = fetchedApps;
        this.getRandomApp();
      });
    }
  }
/*
  async getAppInfo() {
    if(this.dapps.length === 0) {
      this.appsLoaded = false;
      this.dappsService.fetchDapps().subscribe((fetchedApps: Dapp[]) => {
        console.log("DApps fetched", fetchedApps);
        this.appsLoaded = true;
        this.dapps = await this.dappsService.getAppInfo(fetchedApps);
        this.getRandomApp();
      });
    }
  }  */

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant("capsule-market"));
    titleBarManager.setBackgroundColor("#FFFFFF");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.DARK);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    titleBarManager.setupMenuItems([{key: 'registerApp', iconPath: TitleBarPlugin.BuiltInIcon.EDIT, title: 'Register Capsule'}]);
    titleBarManager.addOnItemClickedListener(this.onItemClickedListener = (menuIcon)=>{
      if (menuIcon.key === "registerApp") {
        console.log('Menu item clicked');
        this.registerAppAlert();
      }
    });
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  ionViewWillLeave() {
    titleBarManager.removeOnItemClickedListener(this.onItemClickedListener);
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  getRandomApp() {
    // Select a random app as a showcase dapp
    this.showcaseDapp = this.dapps[Math.floor(Math.random() * this.dapps.length)];
    console.log('Showcase app', this.showcaseDapp);
  }

  getApps(): Dapp[] {
    return this.dapps.filter((app) => app.category !== 'techdemo');
  }

  //// Organize categories by the most apps ////
  getTopCats(): Category[] {
    this.dapps.map(app => {
      this.topCategoriesByAppCount.map(cat => {
        if(app.category === cat.name) {
          cat.appCount++;
        }
      });
    });
    return this.topCategoriesByAppCount.sort((cat1, cat2) => {
      return cat2.appCount - cat1.appCount;
    });
  }

  async registerAppAlert() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Would you like to add Capsule Marketplace to your profile?',
      message: 'Registering a capsule will allow your followers via Contacts to effortlessly browse your favorite capsules!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('No thanks');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            appManager.sendIntent("registerapplicationprofile", {
              identifier: "Capsule Browser",
              connectactiontitle: "Find the latest and greatest Capsules!"
            }, {});
          }
        },
      ]
    });
    alert.present();
  }
}
