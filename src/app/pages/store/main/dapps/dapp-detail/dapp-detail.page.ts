import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Dapp } from '../../../../../dapps.model';
import { DappsService } from '../../../../../dapps.service';

@Component({
  selector: 'app-dapp-detail',
  templateUrl: './dapp-detail.page.html',
  styleUrls: ['./dapp-detail.page.scss'],
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
    });
  }

}
