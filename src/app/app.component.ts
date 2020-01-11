import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DappsService } from './services/dapps.service';
import { SplashscreenPage } from './pages/splashscreen/splashscreen.page';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dappsService: DappsService,
    public modalCtrl: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splash();
      this.dappsService.init();
    });
  }

  async splash() {
    const splash = await this.modalCtrl.create({component: SplashscreenPage});
    return await splash.present();
  }

  minimizeApp() {
    appManager.launcher();
  }

  closeApp() {
    appManager.close();
  }
}
