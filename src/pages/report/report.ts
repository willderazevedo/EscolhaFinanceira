import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//TemplatePages
import { ReportModalPage } from '../report-modal/report-modal';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  reportModal       = ReportModalPage;
  minDate           = new Date();
  maxDate           = new Date(new Date().setFullYear(new Date().getFullYear() + 5));
  actualDate        = new Date();
  tomorrowDate      = new Date(new Date().setDate(new Date().getDate() + 1));
  report_properties = {
    beginDate: this.actualDate.toISOString(),
    finalDate: this.tomorrowDate.toISOString(),
    type: 1,
    category: 1,
    release_type: 1,
    pay_form: 1,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService) {}

  public makeReport() {
    this.global.toggleModal(this.reportModal, { filters: this.report_properties });
  }

  public changeBeginPeriod() {
    let beginDate     = new Date(this.report_properties.beginDate);
    let finalDate     = new Date(this.report_properties.finalDate);
    let yesterdayDate = new Date(new Date(finalDate).setDate(finalDate.getDate() - 1));

    if(finalDate > beginDate) {
      return false;
    }

    this.report_properties.beginDate = yesterdayDate.toISOString();
  }

  public changeFinalPeriod() {
    let beginDate    = new Date(this.report_properties.beginDate);
    let finalDate    = new Date(this.report_properties.finalDate);
    let tomorrowDate = new Date(new Date(beginDate).setDate(beginDate.getDate() + 1));

    if(beginDate < finalDate) {
      return false;
    }

    this.report_properties.finalDate = tomorrowDate.toISOString();
  }

}
