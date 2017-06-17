import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController, LoadingController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';
import { ClosedFixesReleasesDao } from '../../providers/dao/closed-fixes-releases-dao';

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

  fixesModal        = FixesModalPage;
  releases_type     = "out";
  releases_out      = [];
  releases_in       = [];
  temp_releases_out = [];
  temp_releases_in  = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public popoverCtrl: PopoverController, public modalCtrl: ModalController,
  public global: GlobalService, public loadCtrl: LoadingController,
  public fixesDao: FixesReleasesDAO, public closeFixes: ClosedFixesReleasesDao) {
    this.getFixesReleasesOut();
    this.getFixesReleasesIn();
    this.temp_releases_out = this.releases_out;
    this.temp_releases_in  = this.releases_in;
  }

  public filterFixesOut(event) {
    let searched      = event.target.value;
    this.releases_out = this.temp_releases_out;

    if (searched && searched.trim() != '') {
      this.releases_out = this.releases_out.filter((item) => {
        return (item.FIXES_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  public filterFixesIn(event) {
    let searched      = event.target.value;
    this.releases_in = this.temp_releases_in;

    if (searched && searched.trim() != '') {
      this.releases_in = this.releases_in.filter((item) => {
        return (item.FIXES_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  public getFixesReleasesOut() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.fixesDao.selectFixesOut("", data => {
      let length        = data.rows.length;
      let fixesReleases = data;

      for(let i = 0;i < length;i++) {
        this.closeFixes.haveClosedInThisMonth(fixesReleases.rows.item(i).FIXES_ID, data => {

          this.releases_out.push(fixesReleases.rows.item(i));
          this.releases_out[i]["collapse"] = true;
          this.releases_out[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }

      load.dismiss();
    });
  }

  public getFixesReleasesIn() {
    this.fixesDao.selectFixesIn("", data => {
      let length        = data.rows.length;
      let fixesReleases = data;

      for(let i = 0;i < length;i++) {
        this.closeFixes.haveClosedInThisMonth(fixesReleases.rows.item(i).FIXES_ID, data => {

          this.releases_in.push(fixesReleases.rows.item(i));
          this.releases_in[i]["collapse"] = true;
          this.releases_in[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }
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

      this.releases_out = [];
      this.releases_in  = [];
      this.getFixesReleasesOut();
      this.getFixesReleasesIn();
    });
  }

  public toggleModal() {
    let modal = this.modalCtrl.create(this.fixesModal);

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getFixesReleasesOut();
      this.getFixesReleasesIn();
    });
  }

}
