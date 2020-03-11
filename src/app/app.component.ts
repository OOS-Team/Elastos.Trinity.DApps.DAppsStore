import { Component } from '@angular/core';
import { Platform, ModalController, NavController } from '@ionic/angular';
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
    public modalCtrl: ModalController,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.splash();
      this.dappsService.init();

      this.navController.navigateRoot("/store");
    });
  }

  async splash() {
    const splash = await this.modalCtrl.create({component: SplashscreenPage});
    return await splash.present();
  }
}
