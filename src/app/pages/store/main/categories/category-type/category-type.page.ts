import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { DappsService } from '../../../../../dapps.service';
import { Dapp } from '../../../../../dapps.model';

declare let appManager: any;

@Component({
  selector: 'app-category-type',
  templateUrl: './category-type.page.html',
  styleUrls: ['./category-type.page.scss'],
})
export class CategoryTypePage implements OnInit {

  dapps: Dapp[] = [];
  filteredApps: Dapp[] = [];
  categories: any[];
  dapp: string = '';
  categoryType: string = '';
  appsLoaded: boolean = false;

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 4,
  };

  constructor(
    private dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.appsLoaded = false;
    this.categories = this.dappsService.categories;
    this.slideOpts.initialSlide = this.dappsService.index;
    this.route.paramMap.subscribe(paramMap => {
      this.appsLoaded = true;
      if (!paramMap.has('categoryType')) {
        this.navCtrl.navigateBack('/store/tabs/categories');
        return;
      }
      this.dapps = this.dappsService.getCategory(paramMap.get('categoryType'));
      this.filteredApps = this.dapps;
      this.categoryType = paramMap.get('categoryType');
      console.log('category', this.categoryType);
      console.log('dapps', this.filteredApps);
    });
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  // Search
  filterDapps(search: string) {
    this.appsLoaded = false;
    this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      if (this.categoryType === 'new' || 'popular') {
        this.filteredApps = apps;
      } else {
        this.filteredApps = apps.filter(app => app.category === this.categoryType);
      }
    });
    if (search.length === 0) {
      this.filteredApps = this.dapps;
    }
  }

  // Set initial category button
  showCategory(index) {
    this.dappsService.setCatIndex(index);
  }

  closeApp() {
    appManager.close();
  }

  // Install app
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
