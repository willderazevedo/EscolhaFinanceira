import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController, LoadingController, ModalController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

//Template Pages
import { VariousModalPage } from '../various-modal/various-modal';
import { VariousPopoverPage } from '../various-popover/various-popover';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  variousModal  = VariousModalPage;
  releases_type = "out";
  releases_out  = [];
  releases_in   = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public popoverCtrl: PopoverController, public alertCtrl: AlertController,
  public loadCtrl: LoadingController, public modalCtrl: ModalController,
  public variousDao: VariousReleasesDAO) {
    this.getVariousReleasesOut();
    this.getVariousReleasesIn();
  }

  public getVariousReleasesOut() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.variousDao.selectReleasesOut(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.releases_out.push(data.rows.item(i));
        this.releases_out[i]["collapse"] = true;
      }

      load.dismiss();
    });
  }

  public getVariousReleasesIn() {
    this.variousDao.selectReleasesIn(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.releases_in.push(data.rows.item(i));
        this.releases_in[i]["collapse"] = true;
      }
    });
  }

  public togglePopover(event, params = {}){
    event.stopPropagation();

    let popover = this.popoverCtrl.create(VariousPopoverPage, params);

    popover.present({ev: event});
    popover.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getVariousReleasesOut();
      this.getVariousReleasesIn();
    });
  }

  public toggleModal() {
    let modal = this.modalCtrl.create(this.variousModal);

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getVariousReleasesOut();
      this.getVariousReleasesIn();
    });
  }

}
