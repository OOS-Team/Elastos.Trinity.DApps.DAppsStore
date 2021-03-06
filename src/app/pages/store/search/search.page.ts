import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';

import { DappsService } from '../../../services/dapps.service';
import { Dapp } from '../../../models/dapps.model';
import { TranslateService } from '@ngx-translate/core';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('search', {static: false}) search: IonInput;

  // General
  dapps: Dapp[] = [];
  filteredApps: Dapp[] = [];
  searchInput: string = '';
  appsLoaded: boolean = false;
  startedSearching: boolean = false;

  constructor(
    public dappsService: DappsService,
    public toastController: ToastController,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.appsLoaded = true;
    this.dapps = this.dappsService.dapps;

    if(this.dapps.length === 0) {
      this.appsLoaded = false;
      this.dappsService.fetchDapps().subscribe((fetchedApps: Dapp[]) => {
        console.log("Apps fetched from search page", fetchedApps);
        this.appsLoaded = true;
        this.dapps = fetchedApps;
      });
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 200);

    titleBarManager.setTitle(this.translate.instant('search-capsule'));
    this.dappsService.setTitleBarBackKeyShown(true);
  }

  ionViewWillLeave() {
    this.dappsService.setTitleBarBackKeyShown(false);
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  //// Search ////
  filterDapps(search: string) {
    this.startedSearching = true;
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.filteredApps = [];
    } else {
      this.dappsService.fetchFilteredDapps(search).subscribe((searchedApps: Dapp[]) => {
        console.log('Searched apps', searchedApps);
        this.appsLoaded = true;
        this.filteredApps = searchedApps;
      });
    }
  }
}
