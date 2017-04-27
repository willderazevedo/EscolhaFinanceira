import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-fixes-modal',
  templateUrl: 'fixes-modal.html'
})
export class FixesModalPage {

  card:boolean = false;
  out:boolean  = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) {}

  public modalDismiss() {
    this.viewCtrl.dismiss();
  }

  public fieldPlots(hide) {
    this.card = hide;
  }

  public fieldPayForm(hide) {
    this.out = hide;
  }

}
