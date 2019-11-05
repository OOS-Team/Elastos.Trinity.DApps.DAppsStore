import { Component, OnInit } from '@angular/core';

declare let appService: any;

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.page.html',
  styleUrls: ['./my-apps.page.scss'],
})
export class MyAppsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeApp() {
    appService.close();
  }
}
