import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-various-popover',
  templateUrl: 'various-popover.html'
})
export class VariousPopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) {}

  public popoverDismiss() {
    this.viewCtrl.dismiss();
  }

}
