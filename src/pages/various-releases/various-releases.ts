import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController, LoadingController, ModalController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';

//Template Pages
import { VariousModalPage } from '../various-modal/various-modal';
import { VariousPopoverPage } from '../various-popover/various-popover';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  variousModal = VariousModalPage;
  releases     = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService, public popoverCtrl: PopoverController,
  public alertCtrl: AlertController, public loadCtrl: LoadingController,
  public modalCtrl: ModalController, public variousDao: VariousReleasesDAO) {
    this.getVariousReleases();
  }

  public getVariousReleases() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.variousDao.select(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.releases.push(data.rows.item(i));
      }

      load.dismiss();
    });
  }

  public togglePopover(event, params = {}){
    let popover = this.popoverCtrl.create(VariousPopoverPage, params);

    popover.present({ev: event});
    popover.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases = [];
      this.getVariousReleases();
    });
  }

  public toggleModal() {
    let modal = this.modalCtrl.create(this.variousModal);

    modal.present();
    modal.onDidDismiss(() => {
      this.releases = [];
      this.getVariousReleases();
    });
  }

}
