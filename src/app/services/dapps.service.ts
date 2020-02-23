import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Dapp } from '../models/dapps.model';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;
let managerService: any;

@Injectable({
  providedIn: 'root'
})
export class DappsService {

  public _dapps: Dapp[] = [];
  private searchUrl: string = 'https://dapp-store.elastos.org/apps/list?s=';
  private search: string = '';
  private catIndex: number;

  private _categories = [
    'new',
    'popular',
    'finance',
    'tools',
    'communication',
    'social',
    'productivity',
    'business',
    'entertainment',
    'games',
    'music',
    'casino',
    'travel',
    'lifestyle',
    'health'
  ];

  private handledIntentId: Number;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router,
    private zone: NgZone,
  ) {
  }

  //// Initial render ////
  init() {
    console.log("AppmanagerService init");

    // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
    if(this.platform.platforms().indexOf("cordova") >= 0) {
      console.log("Listening to intent events")
      appManager.setIntentListener(
        this.onReceiveIntent
      );
    }
  }

  //// Listen to intent ////
  onReceiveIntent = (ret) => {
    console.log("Intent received", ret);

    switch (ret.action) {
      case "appdetails":
        console.log('Intent recieved', ret);

        this.handledIntentId = ret.intentId;
        this.directToApp(ret.params);

        // For shipping in-store apps to 3rd party apps //
        // this.sendAppsIntent(ret.params);
    }
  }

  //// If apps are loaded, direct user to app details inquired by 3rd party app ////
  async directToApp(appPackage: string) {
    if(this._dapps.length > 0) {
      this._dapps.map(dapp => {
        if(dapp.packageName === appPackage) {
          this.router.navigate(['/store/tabs/dapps/' + dapp._id]);
        }
      });
    } else {
      let appId = await this.waitForAppInquiry(appPackage);
      this.router.navigate(['/store/tabs/dapps/' + appId]);
    }
  }

  //// If apps aren't loaded, wait for apps to load before directing user to app details inquired by 3rd party app ////
  waitForAppInquiry(appPackage: string) {
    return new Promise((resolve, reject) => {
      this.fetchDapps().subscribe((apps: Dapp[]) => {
        apps.map(app => {
          if(app.packageName === appPackage) {
            resolve(app._id);
          };
        });
      }, (err) => {
        console.log('Failed to retrieve apps', err);
      });
    });
  }

  fetchDapps(): Observable<Dapp[]> {
    console.log("Fetching DApps");
    this._dapps = [];
    return this.http.get<Dapp[]>('https://dapp-store.elastos.org/apps/list').pipe(
      tap(response => {
        this._dapps = this._dapps.concat(response);
        console.log("DApps concat", this._dapps);
        this.getAppInfo();
        return this._dapps;
      })
    );
  }

  //// Compare fetched apps with getAppInfos() object values ////
  getAppInfo() {
    appManager.getAppInfos((info) => {
      console.log("App infos", info)
      let installedApps = Object.values(info);

      this._dapps.map(dapp => {
        installedApps.map(app => {
          if (dapp.packageName === app.id) {
            dapp.installed = true;

            if (dapp.versionName !== app.version) {
              console.log(
                'Versions are different', dapp.packageName,
                ' Store version =', dapp.versionName,
                ' Current version =', app.version
              );
              dapp.updateAvailable = this.checkVersion(app.version, dapp.versionName);
            }
          }
        });
      });
    });
  }

  // Since versions aren't numbers nor can they be converted, we need to loop through each number of each version and compare them
  checkVersion(installedVer, storeVer): boolean {
    const oldVer = installedVer.split('.')
    const newVer = storeVer.split('.')
    for (var i = 0; i < storeVer.length; i++) {
      const a = parseInt(newVer[i]) || 0
      const b = parseInt(oldVer[i]) || 0
      if (a > b) return true // If new version is bigger than old version
      if (a < b) return false // If new version is smaller than old version
    }
  }

  fetchFilteredDapps(_search: string): Observable<Dapp[]> {
    this.search = _search;
    console.log('Searching from service.. ', this.search);
    return this.http.get<Dapp[]>(`${this.searchUrl}${this.search}`);
  }

  get dapps() {
    return [...this._dapps];
  }

  get categories() {
    return [...this._categories];
  }

  getDapp(id: string) {
    return {...this._dapps.find(dapp => dapp._id === id)};
  }

  getAppIcon(app: Dapp) {
    return "https://dapp-store.elastos.org/apps/"+app._id+"/icon";
  }

  getAppBanner(app: Dapp) {
    return "https://dapp-store.elastos.org/apps/"+app._id+"/banner";
  }

  getCategory(category: string) {
    if (category === 'new') {
      return [...this._dapps];
    }
    if (category === 'popular') {
      return [...this.dapps].sort((a, b) => {
        return b.downloadsCount - a.downloadsCount;
      })
    }
    else {
      return [...this._dapps.filter(dapp => dapp.category === category)];
    }
  }

  setCatIndex(index: number) {
    this.catIndex = index;
  }

  get index(): number {
    return this.catIndex;
  }

  async installApp(dapp: Dapp) {
    // Download the file
    const epkPath = await this.downloadDapp(dapp);
    console.log("EPK file downloaded and saved to " + epkPath);

    return new Promise((resolve,reject) => {
      appManager.sendIntent(
        'appinstall',
        { url: epkPath, dappStoreServerAppId: dapp._id },
        {},
        (res) => {
          console.log('App installed', res)
          if(res.result.result === 'installed') {
            this._dapps.map(app => {
              if(app._id === dapp._id) {
                app.installed = true;
                app.updateAvailable = false;
              }
            });
            resolve(true);
          } else {
            resolve(false);
          }
        }, (err) => {
          console.log('App install failed', err)
          reject(false);
        }
      );
    });
  }

  downloadDapp(app: Dapp) {
    console.log("App download starting..." + app);

    return new Promise((resolve, reject) => {
      // Download EPK file as blob
      this.http.get('https://dapp-store.elastos.org/apps/'+app._id+'/download', {
        responseType: 'arraybuffer'} ).subscribe(async response => {
        console.log("Downloaded", response);
        let blob = new Blob([response], { type: "application/octet-stream" });
        console.log("Blob", blob);

        // Save to a temporary location
        let filePath = await this._savedDownloadedBlobToTempLocation(blob);

        resolve(filePath);
      });
    });
  }

  _savedDownloadedBlobToTempLocation(blob) {
    let fileName = "appinstall.epk"

    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry: CordovaFilePlugin.DirectoryEntry) => {
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

  startApp(id: string) {
    appManager.start(id);
  }

  // Handle app via browser
  appIntent(dapp: Dapp) {
    console.log('Testing app intent');
    appManager.sendIntent(
      'app',
      { id: dapp.packageName },
      {},
      (res) => {},
      (err) => { 'TEST INTENT FAILED' + err }
    )
  }

  goToLink(site: string) {
    console.log(site);
    appManager.sendUrlIntent(site, () => {}, ()=> {});
  }
}
