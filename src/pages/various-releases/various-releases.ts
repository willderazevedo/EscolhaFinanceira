import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public modal: ModalController, public global: GlobalService,
  public alertCtrl: AlertController) {}

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
