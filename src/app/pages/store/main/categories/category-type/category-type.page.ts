import { Component, OnInit } from '@angular/core';
import { DappsService } from '../../../../../dapps.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Dapp } from '../../../../../dapps.model';

declare let appService: any;

@Component({
  selector: 'app-category-type',
  templateUrl: './category-type.page.html',
  styleUrls: ['./category-type.page.scss'],
})
export class CategoryTypePage implements OnInit {

  dapps: Dapp[];
  filteredDapps: Dapp[];
  categoryType = null;
  appsLoaded = false;

  constructor(
    private dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.appsLoaded = false;
    this.route.paramMap.subscribe(paramMap => {
      this.appsLoaded = true;
      if (!paramMap.has('categoryType')) {
        this.navCtrl.navigateBack('/store/tabs/categories');
        return;
      }
      this.dapps = this.dappsService.getCategory(paramMap.get('categoryType'));
      this.filteredDapps = this.dapps;
      this.categoryType = paramMap.get('categoryType');
      console.log('category' + ' ' + this.categoryType);
      console.log('dapps' + ' ' + this.dapps);
    });
  }

  getAppIcon(app) {
    return this.dappsService.getAppIcon(app);
  }

  /* filterDapps(search) {
    this.filteredDapps = this.dapps.filter((dapp) => {
      return dapp.appName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });
    console.log(this.filteredDapps);
  } */

  filterDapps(search) {
    this.appsLoaded = false;
    this.dappsService.fetchFilteredDapps(search).subscribe((apps: Dapp[]) => {
      this.appsLoaded = true;
      this.filteredDapps = apps.filter(app => app.category === this.categoryType);
    });
    if (search.length === 0) {
      this.filteredDapps = this.dapps;
    }
  }

  closeApp() {
    appService.close();
  }
}
