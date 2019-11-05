import { Component, OnInit } from '@angular/core';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

declare let appService: any;

@Component({
  selector: 'app-dapps',
  templateUrl: './dapps.page.html',
  styleUrls: ['dapps.page.scss'],
})
export class DappsPage implements OnInit {
  applications: Dapp[] = [];
  filteredApps: Dapp[];
  appsLoaded = false;

  constructor(private dappsService: DappsService) {
    this.appsLoaded = false;
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
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
    this.appsLoaded = false;
    this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      this.filteredApps = apps;
    });
    if (search.length === 0) {
      this.filteredApps = this.applications;
    }
  }

  /* filterDapps(search) {
    this.filteredApps = this.applications.filter((dapp) => {
      return dapp.appName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    console.log(this.filteredApps);
  } */


  closeApp() {
   appService.close();
  }
}
