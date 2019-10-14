import { Component, OnInit } from '@angular/core';

import { DappsService } from '../../../../dapps.service';
import { Dapp } from '../../../../dapps.model';

@Component({
  selector: 'app-dapps',
  templateUrl: './dapps.page.html',
  styleUrls: ['./dapps.page.scss'],
})
export class DappsPage implements OnInit {

 applications: Dapp[];


  constructor(private dappsService: DappsService) {
  }

  ngOnInit() {
    this.applications = this.dappsService.dapps;
  }

}


/*
//// API /////

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dapps',
  templateUrl: './dapps.page.html',
  styleUrls: ['./dapps.page.scss'],
})
export class DappsPage implements OnInit {

  applications = [];

  constructor(private http: HttpClient) {

    this.http.get('/storeapi/apps/list').subscribe((response) => {
      this.applications = this.applications.concat(response);
      console.log(this.applications);
    });
  }

  getAppIcon(app) {
    return "/storeapi/apps/"+app._id+"/icon"
  }

  ngOnInit() {}
}
*/
