import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController) {
    this.menu.swipeEnable(false);
  }

}
