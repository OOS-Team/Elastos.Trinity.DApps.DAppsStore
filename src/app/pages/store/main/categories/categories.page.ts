import { Component, OnInit } from '@angular/core';

declare let appService: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeApp() {
    appService.close();
  }
}
