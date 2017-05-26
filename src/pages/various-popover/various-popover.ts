import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';

//Template Pages
import { VariousModalPage } from '../various-modal/various-modal';

//Pages
import { VariousReleasesPage } from '../various-releases/various-releases';

@Component({
  selector: 'page-various-popover',
  templateUrl: 'various-popover.html'
})
export class VariousPopoverPage {

  release       = this.navParams.get('release');
  close_text    = "";
  close_icon    = "";
  various_modal = VariousModalPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public alertCtrl: AlertController, public variousDao: VariousReleasesDAO,
  public global: GlobalService, public modalCtrl: ModalController,
  public closedDao: ClosedVariousReleasesDao) {}

  ionViewDidLoad() {
    this.setCloseText();
  }

  public popoverDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

  public toggleModal() {
    let modal = this.modalCtrl.create(this.various_modal, {release: this.release});

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh) {
        return false;
      }

      this.global.pageNavigation(VariousReleasesPage);
    });
  }

  public setCloseText() {
    this.variousDao.getRemainingPlots(this.release.VARIOUS_ID, res => {
      if(res.rows.item(0) > 1 || this.release.VARIOUS_TYPE == 1) {
        this.close_text = "Fechar lançamento";

        return false;
      }

      this.close_text = "Pagar parcela";
    });
  }

  public confirmDelete() {
    this.alertCtrl.create({
      message: "Você deseja deletar o lançamento: " + this.release.VARIOUS_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.deleteVariousRelease();
          }
        }
      ]
    }).present();
  }

  public confirmClose() {
    this.alertCtrl.create({
      message: "Você deseja fechar o lançamento: " + this.release.VARIOUS_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.closeVariousRelease();
          }
        }
      ]
    }).present();
  }

  private deleteVariousRelease(successMsg = "", errMsg = "", hideLoad = false) {
    let load = this.loadCtrl.create({content:"Deletando Lançamento..."});

    successMsg = successMsg ? successMsg : "Lançamento deletado com sucesso";
    errMsg     = errMsg ? errMsg : "Erro ao deletar lançamento";

    if(!hideLoad) {
      load.present();
    }

    this.variousDao.delete(this.release.VARIOUS_ID, res => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: errMsg,
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: successMsg,
        buttons: [
          {
            text: "Ok",
            handler: () =>{
              this.popoverDismiss(true);
            }
          }
        ]
      }).present();
    });
  }

  private closeVariousRelease() {

    if(this.release.VARIOUS_PAY_FORM == 0){
      this.doCloseInCard();

      return false;
    }

    this.doCloseNormal();
  }

  public doCloseNormal() {
    let load       = this.loadCtrl.create({content:"Fechando lançamento..."});
    let successMsg = "Lançamento fechado com sucesso.";
    let errMsg     = "Erro ao fechar lançamento";

    load.present();
    this.closedDao.closeVariousRelease(this.release, res => {
      if(res.rowsAffected <= 0) {
        load.dismiss();
        this.alertCtrl.create({
          message: "Não foi possivel fechar este lançamento.",
          buttons: ["Ok"]
        }).present();

        return false;
      }


      load.dismiss();
      this.deleteVariousRelease(successMsg, errMsg, true);
    });
}

  public doCloseInCard() {
    let load       = this.loadCtrl.create({content:"Fechando lançamento..."});
    let successMsg = "Laçamento fechado com sucesso.";
    let errMsg     = "Erro ao fechar lançamento";

    load.present();
    this.closedDao.haveClosedInThisMonth(this.release.VARIOUS_ID, res => {
      if(res.rows.length > 0) {
        load.dismiss();
        this.alertCtrl.create({
          message: "A parcela deste lançamento já foi paga este mês.",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.closedDao.closeVariousRelease(this.release, res => {
        if(res.rowsAffected <= 0) {
          load.dismiss();
          this.alertCtrl.create({
            message: "Não foi possivel pagar esta parcela.",
            buttons: ["Ok"]
          }).present();

          return false;
        }

        this.variousDao.getRemainingPlots(this.release.VARIOUS_ID, res => {
          if(res.rows.item(0).REMAIN == 1) {
            load.dismiss();
            this.deleteVariousRelease(successMsg, errMsg, true);

            return false;
          }

          this.variousDao.decreasePlots(this.release.VARIOUS_ID, res => {
            if(res.rowsAffected <= 0) {
              load.dismiss();
              this.alertCtrl.create({
                message: "Não foi possivel decrementar parcela.",
                buttons: ["Ok"]
              }).present();

              return false;
            }

            load.dismiss();
            this.alertCtrl.create({
              message: "Parcela paga com sucesso.",
              buttons: [
                {
                  text: "Ok",
                  handler: () => {
                    this.popoverDismiss(true);
                  }
                }
              ]
            }).present();
          });
        });
      });
    });
  }
}
