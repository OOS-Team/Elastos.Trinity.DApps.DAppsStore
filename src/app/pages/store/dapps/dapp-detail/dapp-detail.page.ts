import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ImageLoaderService } from 'ionic-image-loader';
import { ToastController } from '@ionic/angular';

import { Dapp } from '../../../../models/dapps.model';
import { DappsService } from '../../../../services/dapps.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

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
    public dappsService: DappsService,
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
    appManager.setVisible("show");
    titleBarManager.setTitle("Capsule Info");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
  }

  //// Website clicked ////
  goToLink(site: string) {
    this.dappsService.goToLink(site);
  }
}
