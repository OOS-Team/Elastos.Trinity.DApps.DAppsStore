import { Component, OnInit } from '@angular/core';
import { DappsService } from '../../../../../dapps.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Dapp } from '../../../../../dapps.model';

@Component({
  selector: 'app-category-type',
  templateUrl: './category-type.page.html',
  styleUrls: ['./category-type.page.scss'],
})
export class CategoryTypePage implements OnInit {

  dapps: Dapp[];
  categoryType = null;

  constructor(
    private dappsService: DappsService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('categoryType')) {
        this.navCtrl.navigateBack('/store/tabs/categories');
        return;
      }
      this.dapps = this.dappsService.getCategory(paramMap.get('categoryType'));
      this.categoryType = paramMap.get('categoryType');
      console.log('category' + ' ' + this.categoryType);
      console.log('dapps' + ' ' + this.dapps);
    });
  }

}
