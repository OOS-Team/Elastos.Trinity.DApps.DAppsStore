import { Component, OnInit } from '@angular/core';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

@Component({
  selector: 'app-dapps',
  templateUrl: './dapps.page.html',
  styleUrls: ['dapps.page.scss'],
})
export class DappsPage implements OnInit {
  applications: Dapp[] = [];

  constructor(private dappsService: DappsService) {
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      console.log("DApps fetched", apps);
      this.applications = apps;
    });
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  ngOnInit() {
    // this.applications = this.dappsService.dapps;
  }
}
