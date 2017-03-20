import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-panel',
  templateUrl: 'panel.html'
})
export class PanelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController) {
    this.menu.swipeEnable(true);
  }


}
