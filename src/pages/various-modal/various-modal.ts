import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';

@Component({
  selector: 'page-various-modal',
  templateUrl: 'various-modal.html'
})
export class VariousModalPage {

  card:boolean = false;
  out:boolean  = false;
  releases     = {
    name: "",
    value: "",
    type: 0,
    form: 0,
    plots: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public alertCtrl: AlertController,
  public loadCtrl: LoadingController, public global: GlobalService,
  public variousDao: VariousReleasesDAO) {}

  public saveRelease() {
    let load = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.variousDao.insert(this.releases, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: "Não foi possível salvar este lançamento!"
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento salvo com sucesso!",
        buttons: [
          {
            text:"Ok",
            handler: () => {
              this.viewCtrl.dismiss(true);
            }
          }
        ]
      }).present();
    });
  }

  public modalDismiss() {
    this.viewCtrl.dismiss();
  }

  public fieldPlots(hide) {
    this.card = hide;
  }

  public fieldPayForm(hide) {
    this.out = hide;
  }
}
