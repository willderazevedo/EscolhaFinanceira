import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

@Component({
  selector: 'page-close-releases',
  templateUrl: 'close-releases.html'
})
export class CloseReleasesPage {

  releases = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public loadCtrl: LoadingController, public variousDao: VariousReleasesDAO,
  public alertCtrl: AlertController) {
    this.getClosedReleases();
  }

  public getClosedReleases() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.variousDao.selectCloseds(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.releases.push(data.rows.item(i));
      }

      load.dismiss();
    });
  }

  public confirmOpen(release) {
    this.alertCtrl.create({
      message: "Deseja abrir o lançamento: " + release.VARIOUS_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.openRelease(release);
          }
        }
      ]
    }).present();
  }

  private openRelease(release) {
    let load = this.loadCtrl.create({content:"Abrindo lançamento..."});

    load.present();
    this.variousDao.open(release.VARIOUS_ID, res => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: "Não foi possível abrir este lançamento!",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento aberto com sucesso!",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              this.releases = [];
              this.getClosedReleases();
            }
          }
        ]
      }).present();
    });
  }

}
