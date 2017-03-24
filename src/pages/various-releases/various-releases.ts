import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { ConfigPage } from '../config/config';
import { VariousModalPage } from '../various-modal/various-modal';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  config:Object      = ConfigPage;
  variousModal:Object = VariousModalPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService, public alertCtrl: AlertController) {}

  toggleHelp() {
    let help_alert = this.alertCtrl.create({
      title: "",
      subTitle: "Aqui você será capaz de criar novos lançamentos de entrada ou saída " +
                "diversos. Aperte em + para criar um novo lançamento.",
      buttons: ["Entendi"]
    });

    help_alert.present();
  }

}
