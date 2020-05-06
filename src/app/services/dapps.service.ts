import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Dapp } from '../models/dapps.model';
import { Platform, NavController } from '@ionic/angular';
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
  private dappBeingLaunched: Dapp = null;

  private _categories = [
    'new',
    'popular',
    'finance',
    'tools',
    'communication',
    'social',
    'productivity',
    'shopping',
    'lifestyle',
    'games',
    'casino',
    'music',
    'entertainment',
    'travel',
    'health',
    'techdemo'
  ];

  private handledIntentId: Number;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router,
    private zone: NgZone,
    private navController: NavController
  ) {
  }

  //// Initial render ////
  init() {
    console.log("AppmanagerService init");

    // Load app manager only on real device, not in desktop browser - beware: ionic 4 bug with "desktop" or "android"/"ios"
    if(this.platform.platforms().indexOf("cordova") >= 0) {
      console.log("Listening to intent events")
      appManager.setListener((msg)=>{
        this.onMessageReceived(msg);
      });
      appManager.setIntentListener(
        this.onReceiveIntent
      );
    }
  }

  onMessageReceived(msg: AppManagerPlugin.ReceivedMessage) {
    if (msg.message =="navback") {
      this.navController.back();
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
        return this._dapps;
      })
    );
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
      return [...this._dapps.filter((dapp) => dapp.category !== 'techdemo')];
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

  startApp(dapp: Dapp) {
    console.log("Opening DApp "+dapp.packageName+" through /app intent.");
    this.dappBeingLaunched = dapp;
    appManager.sendIntent(
      'app',
      { id: dapp.packageName },
      {},
      (res) => {
        this.dappBeingLaunched = null;
      },
      (err) => {
        console.log('Failed to launch app using /app intent: ' + err);
        this.dappBeingLaunched = null;
      }
    )
  }

  /**
   * Tells if the given dapp is being launched. If no dapp is provided, tell is there is any dapp being launched.
   */
  isLaunchingApp(app: Dapp = null) {
    if (app) {
      return app == this.dappBeingLaunched;
    }
    else {
      return this.dappBeingLaunched !== null;
    }
  }

  goToLink(site: string) {
    console.log(site);
    appManager.sendUrlIntent(site, () => {}, ()=> {});
  }
}
