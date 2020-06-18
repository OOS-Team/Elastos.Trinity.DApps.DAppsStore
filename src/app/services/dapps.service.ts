import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Dapp } from '../models/dapps.model';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

let managerService: any;

enum MessageType {
    INTERNAL = 1,
    IN_RETURN = 2,
    IN_REFRESH = 3,

    EXTERNAL = 11,
    EX_LAUNCHER = 12,
    EX_INSTALL = 13,
    EX_RETURN = 14,
};

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
    private navController: NavController,
    private translate: TranslateService,
    private zone: NgZone
  ) {
  }

  /********** Initial Render **********/
  init() {
    console.log("AppmanagerService init");
    this.getLanguage();

    if(this.platform.platforms().indexOf("cordova") >= 0) {
      console.log("Listening to intent and message events");
      appManager.setListener((msg) => {
        this.onMessageReceived(msg);
      });
      appManager.setIntentListener(
        this.onReceiveIntent
      );
      titleBarManager.addOnItemClickedListener((menuIcon)=>{
        if (menuIcon.key === "back") {
            this.navController.back();
        }
      });
    }
  }

  getLanguage() {
    appManager.getLocale(
      (defaultLang, currentLang, systemLang) => {
        this.setCurLang(currentLang);
      }
    );
  }

  setCurLang(lang: string) {
    console.log("Setting current language to "+ lang);

    this.zone.run(()=>{
      this.translate.use(lang);
    });
  }

  /********** Message Listener **********/
  onMessageReceived(msg: AppManagerPlugin.ReceivedMessage) {
    var params: any = msg.message;
    if (typeof (params) == "string") {
      try {
          params = JSON.parse(params);
      } catch (e) {
          console.log('Params are not JSON format: ', params);
      }
    }
    switch (msg.type) {
      case MessageType.IN_REFRESH:
        if (params.action === "currentLocaleChanged") {
            this.setCurLang(params.data);
        }
        break;
    }
  }

  /********** Intent Listener **********/
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

  /********** Titlebar Management **********/
  setTitleBarBackKeyShown(show: boolean) {
    if (show) {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
            key: "back",
            iconPath: TitleBarPlugin.BuiltInIcon.BACK
        });
    }
    else {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, null);
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
        this._dapps = response;
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
