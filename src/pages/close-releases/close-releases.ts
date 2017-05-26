import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';
import { ClosedFixesReleasesDao } from '../../providers/dao/closed-fixes-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';

@Component({
  selector: 'page-close-releases',
  templateUrl: 'close-releases.html'
})
export class CloseReleasesPage {

  release_type     = "various";
  various_releases = [];
  fixes_releases   = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public loadCtrl: LoadingController, public variousDao: VariousReleasesDAO,
  public alertCtrl: AlertController, public closedFixesDao: ClosedFixesReleasesDao,
  public closedVariousDao: ClosedVariousReleasesDao) {
    this.getClosedVariousReleases();
    this.getClosedFixesReleases();
  }

  public getClosedVariousReleases() {
    let load = this.loadCtrl.create({content:"Carregando movimentações..."});

    load.present();
    this.closedVariousDao.selectVariousCloseds(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.various_releases.push(data.rows.item(i));
      }

      load.dismiss();
    });
  }

  public getClosedFixesReleases() {
    this.closedFixesDao.selectFixesCloseds(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.fixes_releases.push(data.rows.item(i));
      }
    });
  }

}
