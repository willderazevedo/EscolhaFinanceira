import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

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
  various_modal = VariousModalPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public alertCtrl: AlertController, public variousDao: VariousReleasesDAO,
  public global: GlobalService, public modalCtrl: ModalController) {}

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

  public confirmArchive() {
    this.alertCtrl.create({
      message: "Você deseja arquivar o lançamento: " + this.release.VARIOUS_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.archiveVariousRelease();
          }
        }
      ]
    }).present();
  }

  private deleteVariousRelease() {
    let load = this.loadCtrl.create({content:"Deletando Lançamento..."});

    load.present();
    this.variousDao.delete(this.release.VARIOUS_ID, res => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: "Não foi possível deletar este lançamento!",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento deletado com sucesso!",
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

  private archiveVariousRelease() {
    let load = this.loadCtrl.create({content:"Arquivando Lançamento..."});

    load.present();
    this.variousDao.archive(this.release.VARIOUS_ID, res => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.popoverDismiss();
        this.alertCtrl.create({
          message: "Não foi possível arquivar este lançamento!",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento arquivado com sucesso!",
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
}
