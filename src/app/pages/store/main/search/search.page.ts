import { Component, OnInit } from '@angular/core';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  // General
  dapps: Dapp[] = [];
  filteredApps: Dapp[] = [];
  dapp: string = '';
  appsLoaded: boolean = false;

  constructor(
    private dappsService: DappsService,
  ) {}

  ngOnInit() {
    this.appsLoaded = false;
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      console.log("DApps fetched", apps);
      this.dapps = apps;
    });
  }

  ionViewWillEnter() {
    this.dapps = this.dappsService.dapps;
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // Search
  filterDapps(search) {
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.filteredApps = [];
    } else {
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        this.appsLoaded = true;
        this.filteredApps = apps;
      });
    }
  }

  // Install app
  async installApp(dapp) {
    dapp.installing = true;

    // Download the file
    const epkPath = await this.downloadAppEPK(dapp);
    console.log("EPK file downloaded and saved to " + epkPath);

    // Ask the app installer to install the DApp
    appManager.sendIntent(
      'appinstall',
      { url: epkPath, dappStoreServerAppId: dapp._id },
      () => {
        console.log('App installed');
        dapp.installing = false;
        dapp.installed = true;
      }, (err) => {
        console.log('App install failed', err)
        dapp.installing = false;
      }
    );
  }

  async downloadAppEPK(dapp) {
    return await this.dappsService.downloadDapp(dapp);
  }
}
