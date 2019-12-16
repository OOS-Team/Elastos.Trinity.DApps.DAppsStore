import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ImageLoaderService } from 'ionic-image-loader';
import { ToastController } from '@ionic/angular';

import { Dapp } from '../../../../../dapps.model';
import { DappsService } from '../../../../../dapps.service';

declare let appManager: any;

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
        this.installSuccess(dapp);
      }, (err) => {
        console.log('App install failed', err)
        dapp.installing = false;
        this.installFailed(dapp);
      }
    );
  }

  async downloadAppEPK(dapp) {
    return await this.dappsService.downloadDapp(dapp);
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
