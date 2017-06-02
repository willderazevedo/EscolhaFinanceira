import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

//Data Access Object
import { ReportDao } from '../../providers/dao/report-dao';

@Component({
  selector: 'page-report-modal',
  templateUrl: 'report-modal.html'
})
export class ReportModalPage {

  filters     = this.navParams.get('filters');
  report_data = [];
  total       = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController, public reportDao: ReportDao,
  public loadCtrl: LoadingController) {
    this.buildReport();
  }

  public buildReport() {
    if (this.filters.type == 1) {
      this.getOpenReleasesReport();

      return false;
    }

    this.getClosedReleasesReport();
  }

  private getOpenReleasesReport() {

    let load = this.loadCtrl.create({content: "Construindo relatório..."});

    this.reportDao.selectOpenReleases(this.filters, (res) => {
      let length = res.rows.length;
      let total  = 0;

      for(var i = 0;i < length;i++) {
        this.report_data.push(res.rows.item(i));

        if(this.filters.category == 1) {
          total += this.report_data[i].VARIOUS_VALUE;
        }else{
          total += this.report_data[i].FIXES_VALUE;
        }
      }

      this.total = total;

      load.dismiss();
    });
  }

  private getClosedReleasesReport() {
    let load = this.loadCtrl.create({content: "Construindo relatório..."});

    this.reportDao.selectClosedReleases(this.filters, (res) => {
      let length = res.rows.length;
      let total  = 0;

      for(var i = 0;i < length;i++) {
        this.report_data.push(res.rows.item(i));

        total += this.report_data[i].CLOSED_VALUE;
      }

      this.total = total;

      load.dismiss();
    });
  }

  public modalDismiss() {
    this.viewCtrl.dismiss();
  }

}
