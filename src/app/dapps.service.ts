import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Dapp } from './dapps.model';

@Injectable({
  providedIn: 'root'
})
export class DappsService {

  private _dapps: Dapp[] = [];
  searchUrl: string = 'https://dapp-store.elastos.org/apps/list?s=';
  search: string = '';
  catIndex: number;

  _categories = [
    'new',
    'popular',
    'finance',
    'utility',
    'social',
    'productivity',
    'business',
    'entertainment',
    'games',
    'music',
    'casino',
    'travel',
    'lifestyle'
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

  fetchFilteredDapps(_search: string): Observable<Dapp[]> {
    this.search = _search;
    console.log('Searching from service.. ', this.search);
    return this.http.get<Dapp[]>(`${this.searchUrl}${this.search}`);
  }

  get dapps() {
    return [...this._dapps];
  }

  get categories() {
    return [...this._categories];
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
    if (category === 'new') {
      return [...this._dapps];
    }
    if (category === 'popular') {
      return [...this.dapps].sort((a, b) => {
        return b.downloadsCount - a.downloadsCount;
      })
    }
    else {
      return [...this._dapps.filter(dapp => dapp.category === category)];
    }
  }

  setCatIndex(index) {
    this.catIndex = index;
  }

  get index() {
    return this.catIndex;
  }

  downloadDapp(app) {
    console.log("App download starting...");

    return new Promise((resolve, reject) => {
      // Download EPK file as blob
      this.http.get('https://dapp-store.elastos.org/apps/'+app._id+'/download', {
        responseType: 'arraybuffer'} ).subscribe(async response => {
        console.log("Downloaded", response);
        let blob = new Blob([response], { type: "application/octet-stream" });
        console.log("Blob", blob);

        // Save to a temporary location
        let filePath = await this._savedDownloadedBlobToTempLocation(blob);

        resolve(filePath);
      });
    });
  }

  _savedDownloadedBlobToTempLocation(blob) {
    let fileName = "appinstall.epk"

    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry: DirectoryEntry) => {
          dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
            console.log("Downloaded file entry", fileEntry);
            fileEntry.createWriter((fileWriter) => {
              fileWriter.write(blob);
              resolve("trinity:///data/"+fileName);
            }, (err) => {
              console.error("createWriter ERROR - "+JSON.stringify(err));
              reject(err);
            });
          }, (err) => {
            console.error("getFile ERROR - "+JSON.stringify(err));
            reject(err);
          });
      }, (err) => {
        console.error("resolveLocalFileSystemURL ERROR - "+JSON.stringify(err));
        reject(err);
      });
    });
  }
}
