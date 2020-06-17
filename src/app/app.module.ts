import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageLoader } from 'ionic-image-loader';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { IonicRouteStrategy } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { zh } from './../assets/languages/zh';
import { en } from './../assets/languages/en';
import { fr } from './../assets/languages/fr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashscreenPageModule } from './pages/splashscreen/splashscreen.module';
import { SplashscreenPage } from './pages/splashscreen/splashscreen.page';

import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://6d81a6fb74df4cadb5c2382837f73a44@sentry.io/1875736"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error) {
    console.error("Globally catched exception:", error);

    console.log(document.URL);
    // Only send reports to sentry if we are not debugging.
    if (document.URL.includes('localhost')) { // Prod builds or --nodebug CLI builds use "http://localhost"
      Sentry.captureException(error.originalError || error);
    }
  }
}

export class CustomTranslateLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
      return Observable.create(observer => {
          switch (lang) {
              case 'zh':
                observer.next(zh);
                break;
              case 'fr':
                observer.next(fr);
                break;
              case 'en':
              default:
                observer.next(en);
          }

          observer.complete();
      });
  }
}

export function TranslateLoaderFactory() {
  return new CustomTranslateLoader();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicImageLoader.forRoot(),
    AppRoutingModule,
    SplashscreenPageModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (TranslateLoaderFactory)
      }
    }),
 ],
  bootstrap: [AppComponent],
  entryComponents: [
    SplashscreenPage,
    AppComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WebView,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: ErrorHandler, useClass: SentryErrorHandler}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Needed to find ion-back-button, etc
})
export class AppModule {}
