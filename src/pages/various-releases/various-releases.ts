import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController, LoadingController, ModalController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';

//Template Pages
import { VariousModalPage } from '../various-modal/various-modal';
import { VariousPopoverPage } from '../various-popover/various-popover';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  variousModal      = VariousModalPage;
  releases_type     = "out";
  releases_out      = [];
  releases_in       = [];
  temp_releases_out = [];
  temp_releases_in  = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public popoverCtrl: PopoverController, public alertCtrl: AlertController,
  public loadCtrl: LoadingController, public modalCtrl: ModalController,
  public variousDao: VariousReleasesDAO, public closedVarious: ClosedVariousReleasesDao) {
    this.getVariousReleasesOut();
    this.getVariousReleasesIn();
    this.temp_releases_out = this.releases_out;
    this.temp_releases_in  = this.releases_in;
  }

  public filterVariousOut(event) {
    let searched      = event.target.value;
    this.releases_out = this.temp_releases_out;

    if (searched && searched.trim() != '') {
      this.releases_out = this.releases_out.filter((item) => {
        return (item.VARIOUS_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  public filterVariousIn(event) {
    let searched      = event.target.value;
    this.releases_in = this.temp_releases_in;

    if (searched && searched.trim() != '') {
      this.releases_in = this.releases_in.filter((item) => {
        return (item.VARIOUS_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  public getVariousReleasesOut() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.variousDao.selectVariousOut("", data => {
      let length          = data.rows.length;
      let variousReleases = data;

      for(let i = 0;i < length;i++) {
        this.closedVarious.haveClosedInThisMonth(variousReleases.rows.item(i).VARIOUS_ID, data => {

          this.releases_out.push(variousReleases.rows.item(i));
          this.releases_out[i]["collapse"] = true;
          this.releases_out[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }

      load.dismiss();
    });
  }

  public getVariousReleasesIn() {
    this.variousDao.selectVariousIn("", data => {
      let length = data.rows.length;
      let variousReleases = data;

      for(let i = 0;i < length;i++) {
        this.closedVarious.haveClosedInThisMonth(variousReleases.rows.item(i).VARIOUS_ID, data => {

          this.releases_in.push(variousReleases.rows.item(i));
          this.releases_in[i]["collapse"] = true;
          this.releases_in[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
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
