import { Component, OnInit } from '@angular/core';
import { DappsService } from 'src/app/dapps.service';

declare let appManager: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categories: any[];

  constructor(private dappsService: DappsService) { }

  ngOnInit() {
    this.categories = this.dappsService.categories;
  }

  closeApp() {
    appManager.close();
  }
}
