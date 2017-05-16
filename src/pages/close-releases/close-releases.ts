import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-close-releases',
  templateUrl: 'close-releases.html'
})
export class CloseReleasesPage {

  session = "various";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
