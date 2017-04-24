import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ViewController, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { ConfigDAO } from '../../dao/config-dao';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { PanelPage } from '../panel/panel';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  panel = PanelPage;
  user  = {
    name: "",
    income: null,
    income_day: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController, public global: GlobalService,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public alertCtrl: AlertController, public dao: ConfigDAO) {
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    this.viewCtrl.getNavbar().backButtonClick = () => {
      this.menu.swipeEnable(true);
      this.navCtrl.pop();
    }
  }

  public saveConfig(update = false) {

    let load = this.loadCtrl.create({
      content: "Salvando informações...",
      duration: 1500
    });

    load.present();

    var result = this.dao.insert(this.user);

    load.onDidDismiss(() => {
      // this.global.pageNavigation(this.panel);
      this.alertCtrl.create({
        title: "asd",
        message: "" + JSON.stringify(result)
      }).present();
    });
  }

}
