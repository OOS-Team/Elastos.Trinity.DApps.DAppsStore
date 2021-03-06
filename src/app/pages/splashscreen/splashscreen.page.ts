import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';

declare let appManager: AppManagerPlugin.AppManager;

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public splashScreen: SplashScreen
  ) {}

  ngOnInit() {}

/*   ionViewDidEnter() {
    this.splashScreen.hide();
    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 3000);

    appManager.setVisible("show", ()=>{}, (err)=>{});
  } */
}
