import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController, LoadingController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';

//Template Pages
import { FixesModalPage } from '../fixes-modal/fixes-modal';
import { FixesPopoverPage } from '../fixes-popover/fixes-popover';

@Component({
  selector: 'page-fixes-releases',
  templateUrl: 'fixes-releases.html'
})
export class FixesReleasesPage {

  fixesModal = FixesModalPage;
  releases   = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public popoverCtrl: PopoverController, public modalCtrl: ModalController,
  public global: GlobalService, public loadCtrl: LoadingController,
  public fixesDao: FixesReleasesDAO) {
    this.getFixesReleases();
  }

  public getFixesReleases() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.fixesDao.select(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.releases.push(data.rows.item(i));
        this.releases[i]["collapse"] = true;
      }

      load.dismiss();
    });
  }

  public togglePopover(event, params = {}){
    event.stopPropagation();

    let popover = this.popoverCtrl.create(FixesPopoverPage, params);

    popover.present({ev: event});
    popover.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases = [];
      this.getFixesReleases();
    });
  }

  public toggleModal() {
    let modal = this.modalCtrl.create(this.fixesModal);

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases = [];
      this.getFixesReleases();
    });
  }

}
