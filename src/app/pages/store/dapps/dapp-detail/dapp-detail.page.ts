import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ImageLoaderService } from 'ionic-image-loader';
import { ToastController } from '@ionic/angular';

import { Dapp } from '../../../../models/dapps.model';
import { DappsService } from '../../../../services/dapps.service';
import { TranslateService } from '@ngx-translate/core';

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
    public toastController: ToastController,
    public translate: TranslateService
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
      console.log('Dapp banner', this.dappBanner);
    });
    this.imageLoader.preload('/../../../assets/store/appbanner.jpg');
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('capsule-info'));
    this.dappsService.setTitleBarBackKeyShown(true);
  }

  ionViewWillLeave() {
    this.dappsService.setTitleBarBackKeyShown(false);
  }

  ionViewDidEnter() {
    appManager.setVisible("show");
  }

  //// Website clicked ////
  goToLink(site: string) {
    this.dappsService.goToLink(site);
  }
}
