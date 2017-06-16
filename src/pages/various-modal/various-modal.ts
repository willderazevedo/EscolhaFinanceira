import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';
import { TotoroBotService } from '../../providers/totoro-bot-service';
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-various-modal',
  templateUrl: 'various-modal.html'
})
export class VariousModalPage {

  card           = false;
  out            = false;
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
  public variousDao: VariousReleasesDAO, public closedVariousDao: ClosedVariousReleasesDao,
  public totoroBot: TotoroBotService, public vars: VarsService) {
    this.populateRelease();
  }

  private checkFields() {
    let empty = false;
    let field = this.releases;

    if(!field.name || !field.value || (field.type == 0 && field.form == 0 && (!field.plots || field.plots === "0"))) {
      empty = true;
    }

    return empty;
  }

  private checkValue() {
    let income       = this.vars.income;
    let invalidValue = false;

    if((this.releases.form == 1 && parseFloat(this.releases.value) > income)) {
      invalidValue = true;
    }

    return invalidValue;
  }

  public saveRelease() {
    let load         = this.loadCtrl.create({
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
    let load         = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    if(this.releases.form == 1)
      this.releases.plots = "";

    load.present();
    this.closedVariousDao.getPayVariousRelease(this.release_update.VARIOUS_ID, (res) => {
      if(res.rows.length > 0){
        load.dismiss();
        this.alertCtrl.create({
          message: "Não é possível alterar este lançamento pois algumas parcelas já foram pagas.",
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.modalDismiss();
              }
            }
          ]
        }).present();

        return false;
      }

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

    this.totoroBot.caseOneVarious(this.releases, saveTip => {
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
    this.totoroBot.caseTwoVarious(this.releases, saveTip => {
      if(!saveTip) {
        this.initializeCaseThree();

        return false;
      }

      this.alertCtrl.create({
        message: saveTip,
        buttons: [
          {text:"Cancelar"},
          {text:"Continuar", handler: () => this.initializeCaseThree()}
        ]
      }).present();
    });
  }

  private initializeCaseThree() {
    this.totoroBot.caseThreeVarious(this.releases, saveTip => {
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

  public fieldPlots(hide) {
    this.card = hide;
  }

  public fieldPayForm(hide) {
    this.out = hide;
  }
}
