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

    // Save to temporary path
    // TODO

    // Ask the app install to install the DApp
    // TODO
    appService.sendIntent("appinstall", {url:"trinity:///data/temp"})
  }

  async downloadAppEPK(dapp) {
    this.dappsService.downloadDapp(dapp)
  }
}
