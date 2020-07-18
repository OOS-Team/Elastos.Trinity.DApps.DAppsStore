import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { DappsService } from '../../../../services/dapps.service';
import { Dapp } from '../../../../models/dapps.model';
import { TranslateService } from '@ngx-translate/core';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-category-type',
  templateUrl: './category-type.page.html',
  styleUrls: ['./category-type.page.scss'],
})
export class CategoryTypePage implements OnInit {

  dapps: Dapp[] = [];
  searchInput: string = '';
  categories: string[];
  categoryType: string = '';
  appsLoaded: boolean = true;

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 4,
  };

  constructor(
    public dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public toastController: ToastController,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.categories = this.dappsService.categories;
    this.slideOpts.initialSlide = this.dappsService.index;

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('categoryType')) {
        this.navCtrl.navigateBack('/store/tabs/categories');
        return;
      }
      this.dapps = this.dappsService.getCategory(paramMap.get('categoryType'));
      this.categoryType = paramMap.get('categoryType');
      console.log('category', this.categoryType);
    });
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant(this.categoryType));
    this.dappsService.setTitleBarBackKeyShown(true);
  }

  ionViewWillLeave() {
    this.dappsService.setTitleBarBackKeyShown(false);
  }

  //// Change category tab ////
  changeCat(cat: string) {
    this.categoryType = cat;
    this.dapps = this.dappsService.getCategory(cat);
    titleBarManager.setTitle(this.categoryType.charAt(0).toUpperCase() + this.categoryType.slice(1));
  }

  getAppIcon(app: Dapp) {
    return this.dappsService.getAppIcon(app);
  }

  //// Search ////
  filterDapps(search: string) {
    this.appsLoaded = false;
    if (!search) {
      this.appsLoaded = true;
      this.dapps = this.dappsService.getCategory(this.categoryType);
    } else {
      this.dappsService.fetchFilteredDapps(search).subscribe((searchedApps: Dapp[]) => {
        this.appsLoaded = true;
        this.dapps = [];
        this.dapps = searchedApps.filter(app => app.category === this.categoryType);
        if (this.categoryType === 'new') {
          this.dapps = searchedApps;
        }
        if (this.categoryType === 'popular') {
          this.dapps = searchedApps;
        }
      });
    }
  }
}
