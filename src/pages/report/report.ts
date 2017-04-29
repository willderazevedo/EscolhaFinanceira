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

  reportModal:Object = ReportModalPage;
  out:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService) {}

  public fieldPayForm(hide) {
    this.out = hide;
  }

}
