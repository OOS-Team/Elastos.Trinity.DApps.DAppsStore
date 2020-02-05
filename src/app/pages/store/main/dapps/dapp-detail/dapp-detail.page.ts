import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ImageLoaderService } from 'ionic-image-loader';
import { ToastController } from '@ionic/angular';

import { Dapp } from '../../../../../models/dapps.model';
import { DappsService } from '../../../../../services/dapps.service';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-dapp-detail',
  templateUrl: './dapp-detail.page.html',
  styleUrls: ['./dapp-detail.page.scss'],
})
export class DappDetailPage implements OnInit {

  dapp: Dapp;
  dappIcon: string = '';
  dappBanner: string = '';

  constructor(
    private dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private imageLoader: ImageLoaderService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dappId')) {
        this.navCtrl.navigateBack('/store/tabs/dapps');
        return;
      }
      this.dapp = this.dappsService.getDapp(paramMap.get('dappId'));
      this.dappIcon = this.dappsService.getAppIcon(this.dapp);
      this.dappBanner = this.dappsService.getAppBanner(this.dapp);
      console.log('Dapp', this.dapp);
    });
    this.imageLoader.preload('/../../../assets/store/appbanner.jpg');
  }

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});
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

  //// Website clicked ////
  goToLink(site: string) {
    this.dappsService.goToLink(site);
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
