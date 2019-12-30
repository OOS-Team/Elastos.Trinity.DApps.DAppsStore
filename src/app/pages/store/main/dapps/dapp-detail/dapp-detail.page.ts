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
      duration: 2000
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
