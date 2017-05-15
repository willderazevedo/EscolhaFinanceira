import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

@Component({
  selector: 'page-various-popover',
  templateUrl: 'various-popover.html'
})
export class VariousPopoverPage {

  release = this.navParams.get('release');

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public alertCtrl: AlertController, public variousDao: VariousReleasesDAO) {}

  public popoverDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
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
}
