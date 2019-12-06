import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-dapps',
  templateUrl: './dapps.page.html',
  styleUrls: ['dapps.page.scss'],
})
export class DappsPage implements OnInit {

  // General
  applications: Dapp[] = [];
  filteredApps: Dapp[] = [];
  appsLoaded: boolean = false;

  // Segment
  categories = [
    'new',
    'popular',
    'finance',
    'utility',
    'social',
    'productivity',
    'business',
    'entertainment',
    'games',
    'music',
    'casino',
    'travel',
    'lifestyle'
  ];

  // Sections
  finance: Dapp[] = [];
  utility: Dapp[] = [];
  social: Dapp[] = [];
  productivity: Dapp[] = [];
  business: Dapp[] = [];
  entertainment: Dapp[] = [];
  games: Dapp[] = [];
  music: Dapp[] = [];
  casino: Dapp[] = [];
  travel: Dapp[] = [];
  lifestyle: Dapp[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 3.5
  };

  constructor(
    private dappsService: DappsService,
    private http: HttpClient
  ) {
    this.appsLoaded = false;
    this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      console.log("DApps fetched", apps);
      this.applications = apps;
      this.filteredApps = this.applications;
      this.finance = this.filteredApps.filter(app => app.category === 'finance');
      this.utility = this.filteredApps.filter(app => app.category === 'utility');
      this.social = this.filteredApps.filter(app => app.category === 'social');
      this.productivity = this.filteredApps.filter(app => app.category === 'productivity');
      this.business = this.filteredApps.filter(app => app.category === 'business');
      this.entertainment = this.filteredApps.filter(app => app.category === 'entertainment');
      this.games = this.filteredApps.filter(app => app.category === 'games');
      this.music = this.filteredApps.filter(app => app.category === 'music');
      this.casino = this.filteredApps.filter(app => app.category === 'casino');
      this.travel = this.filteredApps.filter(app => app.category === 'travel');
      this.lifestyle = this.filteredApps.filter(app => app.category === 'lifestyle');
    });
  }

  ngOnInit() {}

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // search
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

  // installation
  async installApp(dapp) {
    // Download the file
    const epkPath = await this.downloadAppEPK(dapp);
    console.log("EPK file downloaded and saved to " + epkPath);

    // Ask the app installer to install the DApp
    appManager.sendIntent("appinstall", {url: epkPath, dappStoreServerAppId: dapp._id});
  }

  async downloadAppEPK(dapp) {
    return await this.downloadDapp(dapp);
  }

  downloadDapp(app) {
    console.log("App download starting...");
    app.installing = true;

    return new Promise((resolve, reject) => {
      // Download EPK file as blob
      this.http.get('https://dapp-store.elastos.org/apps/'+app._id+'/download', {
        responseType: 'arraybuffer'} ).subscribe(async response => {
        console.log("Downloaded", response);
        let blob = new Blob([response], { type: "application/octet-stream" });
        console.log("Blob", blob);
        app.installing = false;
        app.installed = true;

        // Save to a temporary location
        let filePath = await this._savedDownloadedBlobToTempLocation(blob);

        resolve(filePath);
      });
    });
  }

  _savedDownloadedBlobToTempLocation(blob) {
    let fileName = "appinstall.epk"

    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry: DirectoryEntry) => {
          dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
            console.log("Downloaded file entry", fileEntry);
            fileEntry.createWriter((fileWriter) => {
              fileWriter.write(blob);
              resolve("trinity:///data/"+fileName);
            }, (err) => {
              console.error("createWriter ERROR - "+JSON.stringify(err));
              reject(err);
            });
          }, (err) => {
            console.error("getFile ERROR - "+JSON.stringify(err));
            reject(err);
          });
      }, (err) => {
        console.error("resolveLocalFileSystemURL ERROR - "+JSON.stringify(err));
        reject(err);
      });
    });
  }
}
