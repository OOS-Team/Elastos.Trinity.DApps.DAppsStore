import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Dapp } from '../../../../../dapps.model';
import { DappsService } from '../../../../../dapps.service';

declare let appService: any;

@Component({
  selector: 'app-dapp-detail',
  templateUrl: './dapp-detail.page.html',
  styleUrls: ['./dapp-detail.page.scss'],
})
export class DappDetailPage implements OnInit {

  dapp: Dapp;
  dappBanner = '';
  installing = false;

  constructor(
    private dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dappId')) {
        this.navCtrl.navigateBack('/store/tabs/dapps');
        return;
      }
      this.dapp = this.dappsService.getDapp(paramMap.get('dappId'));
      this.dappBanner = this.dappsService.getAppBanner(this.dapp);
      console.log('Dapp =' + ' ' + this.dapp);
      console.log('Dapp Banner =' + ' ' + this.dappBanner);
    });
  }

  async installApp(dapp) {
    this.installing = true;
    // Download the file
    const epkPath = await this.downloadAppEPK(dapp);
    console.log("EPK file downloaded and saved to " + epkPath);
    if (epkPath) {
      this.installing = false;
    }
    // Ask the app installer to install the DApp
    appService.sendIntent("appinstall", {url: epkPath, dappStoreServerAppId: dapp._id});
  }

  async downloadAppEPK(dapp) {
    return await this.dappsService.downloadDapp(dapp);
  }

  closeApp() {
    appService.close();
  }
}
