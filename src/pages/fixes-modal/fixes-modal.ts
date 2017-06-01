import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';

@Component({
  selector: 'page-fixes-modal',
  templateUrl: 'fixes-modal.html'
})
export class FixesModalPage {

  release_update = this.navParams.get('release');
  releases       = {
    id: "",
    name: "",
    value: "",
    type: 1,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public alertCtrl: AlertController, public fixesDao: FixesReleasesDAO) {
    this.populateRelease();
  }

  private checkFields() {
    let empty = false;
    let field = this.releases;

    if(!field.name || !field.value) {
      empty = true;
    }

    return empty;
  }

  public saveRelease() {
    let empty = this.checkFields();
    let load  = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    if(empty){
      this.alertCtrl.create({
        message: "Preencha todos os campos corretamente.",
        buttons: ["Ok"]
      }).present();

      return false;
    }

    load.present();
    this.fixesDao.insert(this.releases, (res) => {
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
    let empty = this.checkFields();
    let load  = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    if(empty){
      this.alertCtrl.create({
        message: "Preencha todos os campos corretamente.",
        buttons: ["Ok"]
      }).present();

      return false;
    }

    load.present();
    this.fixesDao.update(this.releases, (res) => {
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

    this.releases.id    = this.release_update.FIXES_ID;
    this.releases.name  = this.release_update.FIXES_NAME;
    this.releases.type  = this.release_update.FIXES_TYPE;
    this.releases.value = this.release_update.FIXES_VALUE;
  }

  public modalDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

}
