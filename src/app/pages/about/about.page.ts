import { Component, OnInit } from '@angular/core';

declare let appService: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeApp() {
    appService.close();
  }

}
