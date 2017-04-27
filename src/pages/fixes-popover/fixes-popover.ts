import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-fixes-popover',
  templateUrl: 'fixes-popover.html'
})
export class FixesPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) {}

  public popoverDismiss() {
    this.viewCtrl.dismiss();
  }

}
