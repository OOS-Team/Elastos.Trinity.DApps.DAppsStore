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
  filteredApps: Dapp[];

  constructor(private dappsService: DappsService) {
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      console.log("DApps fetched", apps);
      this.applications = apps;
      this.filteredApps = this.applications;
    });
  }

  ngOnInit() {}

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  filterDapps(search) {
    this.filteredApps = this.applications.filter((dapp) => {
      return dapp.appName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    console.log(this.filteredApps);
  }
}
