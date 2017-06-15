import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';

//Providers
import { TotoroBotService } from '../../providers/totoro-bot-service';
import { VarsService } from '../../providers/vars-service';

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
  public alertCtrl: AlertController, public fixesDao: FixesReleasesDAO,
  public totoroBot: TotoroBotService, public vars: VarsService) {
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

  private checkValue() {
    let income       = this.vars.income;
    let invalidValue = false;

    if(parseFloat(this.releases.value) > income) {
      invalidValue = true;
    }

    return invalidValue;
  }

  public saveRelease() {
    let load         = this.loadCtrl.create({
      content: "Salvando informações...",
    });

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
    let load         = this.loadCtrl.create({
      content: "Salvando informações...",
    });

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

  public initializeCaseOne() {
    let empty        = this.checkFields();
    let invalidValue = this.checkValue();

    if(empty){
      this.alertCtrl.create({
        message: "Preencha todos os campos corretamente.",
        buttons: ["Ok"]
      }).present();

      return false;
    }

    if(invalidValue){
      this.alertCtrl.create({
        message: "O valor não deve ultrapassar sua renda.",
        buttons: ["Ok"]
      }).present();

      return false;
    }

    this.totoroBot.caseOneFixes(this.releases, saveTip => {

      if(!saveTip) {
        this.initializeCaseTwo();

        return false;
      }

      this.alertCtrl.create({
        message: saveTip,
        buttons: [
          {text:"Cancelar"},
          {text:"Continuar", handler: () => this.initializeCaseTwo()}
        ]
      }).present();

    });
  }

  private initializeCaseTwo() {
    this.totoroBot.caseTwoFixes(this.releases, saveTip => {

      if(!saveTip) {

        if(this.release_update) {
          this.updateRelease();

          return false;
        }

        this.saveRelease();

        return false;
      }

      this.alertCtrl.create({
        message: saveTip,
        buttons: [
          {text:"Cancelar"},
          {text:"Continuar", handler: () => this.release_update ? this.updateRelease() : this.saveRelease()}
        ]
      }).present();

    });
  }

  public modalDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

}
