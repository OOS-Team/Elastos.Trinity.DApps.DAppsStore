import { Component, OnInit } from '@angular/core';
import { DappsService } from 'src/app/services/dapps.service';
import { TranslateService } from '@ngx-translate/core';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories: any[];

  constructor(private dappsService: DappsService, public translate: TranslateService) { }

  ngOnInit() {
    this.categories = this.dappsService.categories;
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant("cats"));
    this.dappsService.setTitleBarBackKeyShown(true);
  }

  ionViewWillLeave() {
    this.dappsService.setTitleBarBackKeyShown(false);
  }
}
