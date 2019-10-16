import { Injectable } from '@angular/core';
import { Dapp } from './dapps.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, flatMap, mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DappsService {

  private _dapps: Dapp[] = [
    /*new Dapp(
     '1', // _id
     0.1, // versionCode
     '1.0', // versionName
     'chad@gmail.com', // authorEmail
     'Chad Racelis', // authorName,
     'www.chadracelis.com', // authorWebsite
     'Eth Homes', // appName
     '01.10.2019', // createdAt
     'Land Title Management', // appShortDescription
     'Eth Homes is like no other real estate law firm you have ever worked with.  The firm offers quality residential and commercial real estate closing services throughout Connecticut, with a concentration on Fairfield County. The firm is proud to offer flat fee, low cost closings for all of its clients, including first time home owners. On average, our pricing will be 10-15% LOWER than other firms. Per Connecticut law, our closing fee cannot include the title insurance premium. This is a separate charge which will always be based on the purchase price and/or loan amount.  Please call or email us to receive your title insurance premium quote.  All rates are determined by the State of Connecticut and cannot be discounted.', // appDescription
     'Business.test',  // packageName,
     'Business', // category
     1, // downloadsCount
     'https://cdn.pixabay.com/photo/2016/06/24/10/47/architecture-1477041_1280.jpg',
    ),
    new Dapp(
      '2', // _id
      0.2, // versionCode
      '2.0', // versionName
      'mike@gmail.com', // authorEmail
      'Mike Razi', // authorName,
      'www.mikerazi.com', // authorWebsite
      'Neo Games', // appName
      '02.10.2019', // createdAt
      'Arcade Style Fun', // appShortDescription
      'Neo Games is a fun multiplayer game where you and a friend can play against each other on a variety of games. This physics style game has different game types that you can play at random including a soccer match and sniper warfare. All of the different games have a one-button control system making them easy to play for the maximum amount of fun.', // appDescription
      'Games.test',  // packageName,
      'Games', // category
      2, // downloadsCount
      'https://cdn.pixabay.com/photo/2016/11/21/15/08/computer-1845880_1280.jpg',
    ),
    new Dapp(
      '3', // _id
      0.3, // versionCode
      '3.0', // versionName
      'ben@gmail.com', // authorEmail
      'Ben Shapiro', // authorName,
      'www.benshapiro.com', // authorWebsite
      'Ela Identity', // appName
      '03.10.2019', // createdAt
      'Identity Protection Everywhere', // appShortDescription
      'Ela Identity Does More Than Just Monitoring, We also Help Fix Identity Theft Issues! 24/7 Live Member Support. 24/7 Member Support. 24/7 Customer Service. Sign up in Minutes. Millions of Members. An Industry Leader. Identity Theft Alerts. Trusted by Millions.', // appDescription
      'Utility.test',  // packageName,
      'Utility', // category
      3, // downloadsCount
      'https://cdn.pixabay.com/photo/2017/02/19/23/10/finger-2081169_1280.jpg',
    ),
    new Dapp(
      '4', // _id
      0.4, // versionCode
      '4.0', // versionName
      'nick@gmail.com', // authorEmail
      'Nick Mazzoni', // authorName,
      'www.nickmazzoni.com', // authorWebsite
      'Futures Dexchange ', // appName
      '04.10.2019', // createdAt
      'P2P Margin Trading', // appShortDescription
      'Futures Dexchange is the safest, fastest, most transparent, and user friendly Bitcoin and Ethereum trading platform offering cryptocurrency perpetual contracts.', // appDescription
      'Finance.test',  // packageName,
      'Finance', // category
      4, // downloadsCount
      'https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg'
    ),
    new Dapp(
      '5', // _id
      0.5, // versionCode
      '5.0', // versionName
      'bill@gmail.com', // authorEmail
      'Bill McCarthy', // authorName,
      'www.billmccarthy.com', // authorWebsite
      'Ultimate Texas Poker', // appName
      '05.10.2019', // createdAt
      'Get Your Gamble On', // appShortDescription
      'Fans of Ultimate Texas Poker will love playing online poker games without the stress of the casino! Dont settle for the all-in poker fests in OTHER social poker ...', // appDescription
      'Casino.test',  // packageName,
      'Casino', // category
      5, // downloadsCount
      'https://cdn.pixabay.com/photo/2017/04/03/11/47/poker-2198117_1280.jpg'
    ),
    new Dapp(
      '6', // _id
      0.6, // versionCode
      '6.0', // versionName
      'joe@gmail.com', // authorEmail
      'Joe Yager', // authorName,
      'www.joeyager.com', // authorWebsite
      'ElaBook', // appName
      '06.10.2019', // createdAt
      'Meet Friends Online', // appShortDescription
      'Elabook, inc. is an American online social media and social networking service company based in Menlo Park, California. It was founded by Mark Zuckerberg, along with fellow Harvard College students and roommates Eduardo Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes.', // appDescription
      'Social.test',  // packageName,
      'Social', // category
      6, // downloadsCount
      'https://cdn.pixabay.com/photo/2016/02/18/22/18/picnic-1208229_1280.jpg'
    )*/
  ];

  constructor(private http: HttpClient) {}

  fetchDapps(): Observable<Dapp[]> {
    console.log("Fetching DApps");

    this._dapps = [];
    return this.http.get<Dapp[]>('https://dapp-store.elastos.org/apps/list').pipe(
      tap(response => {
        this._dapps = this._dapps.concat(response);
        console.log("DApps concat", this._dapps);
        return this._dapps;
      })
    );
  }

  get dapps() {
    return [...this._dapps];
  }

  getDapp(id: string) {
    return {...this._dapps.find(dapp => dapp._id === id)};
  }

  getAppIcon(app) {
    return "https://dapp-store.elastos.org/apps/"+app._id+"/icon";
  }

  getAppBanner(app) {
    return "https://dapp-store.elastos.org/apps/"+app._id+"/banner";
  }

  getCategory(category: string) {
    return [...this._dapps.filter(dapp => dapp.category === category)];
  }

  downloadDapp(app) {
    console.log("App download starting...");

    return new Promise((resolve, reject)=> {
      // Download EPK file as blob
      this.http.get('https://dapp-store.elastos.org/apps/'+app._id+'/download', {
        responseType: 'arraybuffer'} ).subscribe(async response => {
        console.log("Downloaded", response);

        let blob = new Blob([response], { type: "application/octet-stream" });
        console.log("Blob", blob);

        // Save to a temporary location
        let filePath = await this._savedDownloadedBlobToTempLocation(blob)

        resolve(filePath);
      });
    });
  }

  _savedDownloadedBlobToTempLocation(blob) {
    let filePath = "trinity:///temp/appinstall.epk"

    return new Promise((resolve, reject) => {
      window.requestFileSystem(window.PERSISTENT, 10241024, (fs) => {
        fs.root.getFile(filePath, { create: true, exclusive: false }, (fileEntry) => {
          fileEntry.createWriter((fileWriter) => {
            fileWriter.write(blob);
            resolve(filePath);
          }, (err) => {
            console.error("createWriter ERROR -" + JSON.stringify(err));
            reject(err);
          });
        }, (err) => {
          console.error("getFile ERROR -" + JSON.stringify(err));
          reject(err);
        });
      }, (err) => {
        console.error("requestFileSystem ERROR -" + JSON.stringify(err));
        reject(err);
      });
    });
  }
}
