import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { ReportModalPage } from '../report-modal/report-modal';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  out:boolean        = false;
  reportModal:Object = ReportModalPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService) {}

  fieldPayForm(hide) {
    this.out = hide;
  }

}
