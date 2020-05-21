import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

import { DappsService } from 'src/app/services/dapps.service';
import { Dapp } from 'src/app/models/dapps.model';
import { Category } from 'src/app/models/categories.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  applications: Dapp[] = [];
  categories: Category[] = [];
  randomDapp: Dapp;
  appsLoaded: boolean = false;
  onItemClickedListener: any;

  constructor(
    public dappsService: DappsService,
    public toastController: ToastController,
    private alertController: AlertController,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.appsLoaded = true;
    this.applications = this.dappsService.dapps;
    this.getRandomApp();

    this.dappsService.categories.map(cat => {
      this.categories.push({
        name: cat,
        appCount: null
      });
    });

    if(this.applications.length === 0) {
      this.appsLoaded = false;
      this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
        console.log("DApps fetched", apps);
        this.appsLoaded = true;
        this.applications = apps;
        this.getRandomApp();
      });
    }
  }

  ionViewWillEnter() {
    titleBarManager.setTitle("Capsule Marketplace");
    titleBarManager.setBackgroundColor("#FFFFFF");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.DARK);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
    titleBarManager.setupMenuItems([{key: 'registerApp', iconPath: '/assets/images/register.png', title: 'Register Capsule'}]);
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
    this.randomDapp = this.applications[Math.floor(Math.random() * this.applications.length)];
    console.log('App showcase', this.randomDapp);
  }

  getApps(): Dapp[] {
    return this.applications.filter((app) => app.category !== 'techdemo');
  }

  //// Organize categories by the most apps ////
  getTopCats() {
    this.applications.map(app => {
      this.categories.map(cat => {
        if(app.category === cat.name) {
          cat.appCount++;
        }
      })
    })
    return this.categories.sort((cat1, cat2) => {
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
