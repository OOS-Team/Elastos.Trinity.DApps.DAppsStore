import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageLoader } from 'ionic-image-loader';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { IonicRouteStrategy } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SplashscreenPageModule } from './pages/splashscreen/splashscreen.module';
import { SplashscreenPage } from './pages/splashscreen/splashscreen.page';

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
    SplashscreenPageModule
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
    //{provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Needed to find ion-back-button, etc
})
export class AppModule {}
