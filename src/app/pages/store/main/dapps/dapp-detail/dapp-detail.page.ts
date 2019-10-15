import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Dapp } from '../../../../../dapps.model';
import { DappsService } from '../../../../../dapps.service';

declare let appService: any;

@Component({
  selector: 'app-dapp-detail',
  templateUrl: './dapp-detail.page.html',
  styles: ['./dapp-detail.page.scss'],
})
export class DappDetailPage implements OnInit {

  dapp: Dapp;

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

      console.log(this.dapp)
    });
  }

  getAppBanner(app) {
    return this.dappsService.getAppBanner(app)
  }

  async installApp(dapp) {
    // Download the file
    let epkPath = await this.downloadAppEPK(dapp);
    console.log("EPK file downloaded and saved to "+epkPath)

    // Ask the app installer to install the DApp
    appService.sendIntent("appinstall", {url:"trinity:///appinstall.epk"})
  }

  async downloadAppEPK(dapp) {
    await this.dappsService.downloadDapp(dapp)
  }
}
