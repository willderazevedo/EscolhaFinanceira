import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  out:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService, public vars: VarsService) {}

  public fieldPayForm(hide) {
    this.out = hide;
  }

}
