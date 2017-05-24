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

  card:boolean   = false;
  out:boolean    = false;
  release_update = this.navParams.get('release');
  releases       = {
    id: "",
    name: "",
    value: "",
    type: 1,
    form: 1,
    plots: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public alertCtrl: AlertController,
  public loadCtrl: LoadingController, public global: GlobalService,
  public variousDao: VariousReleasesDAO) {
    this.populateRelease();
  }

  public saveRelease() {
    let load = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.variousDao.insert(this.releases, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: "Não foi possível salvar este lançamento!",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento salvo com sucesso!",
        buttons: [
          {
            text:"Ok",
            handler: () => {
              this.modalDismiss(true);
            }
          }
        ]
      }).present();
    });
  }

  public updateRelease() {
    let load = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    if(this.releases.form == 1)
      this.releases.plots = "";  

    load.present();
    this.variousDao.update(this.releases, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: "Não foi possível salvar este lançamento!",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento salvo com sucesso!",
        buttons: [
          {
            text:"Ok",
            handler: () => {
              this.modalDismiss(true);
            }
          }
        ]
      }).present();
    });
  }

  private populateRelease() {

    if(!this.release_update) {
      return false;
    }

    this.releases.id    = this.release_update.VARIOUS_ID;
    this.releases.name  = this.release_update.VARIOUS_NAME;
    this.releases.type  = this.release_update.VARIOUS_TYPE;
    this.releases.form  = this.release_update.VARIOUS_PAY_FORM;
    this.releases.plots = this.release_update.VARIOUS_PLOTS;
    this.releases.value = this.release_update.VARIOUS_VALUE;
  }

  public modalDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

  public fieldPlots(hide) {
    this.card = hide;
  }

  public fieldPayForm(hide) {
    this.out = hide;
  }
}
