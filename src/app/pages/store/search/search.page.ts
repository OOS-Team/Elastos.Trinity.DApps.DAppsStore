import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';

import { DappsService } from '../../../services/dapps.service';
import { Dapp } from '../../../models/dapps.model';

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
  dapp: string = '';
  appsLoaded: boolean = false;

  constructor(
    public dappsService: DappsService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.appsLoaded = true;
    this.dapps = this.dappsService.dapps;

    if(this.dapps.length === 0) {
      this.appsLoaded = false;
      this.dappsService.fetchDapps().subscribe((apps: Dapp[]) => {
        console.log("DApps fetched", apps);
        this.appsLoaded = true;
        this.dapps = apps;
      });
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 200);

    titleBarManager.setTitle("Search Capsule");
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  //// Search ////
  filterDapps(search: string) {
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.filteredApps = [];
    } else {
      this.filteredApps = [];
      this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
        console.log('Searched apps', apps);
        this.appsLoaded = true;
        this.dapps.map(dapp => {
          apps.map(app => {
            if(dapp.packageName === app.packageName) {
              this.filteredApps = this.filteredApps.concat(dapp);
            }
          });
        });
      });
    }
  }
}
