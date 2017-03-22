import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { GlobalService } from '../../providers/global-service';

//Pages
import { PanelPage } from '../panel/panel';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  panel:Object = PanelPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController, public global: GlobalService) {
    this.menu.swipeEnable(false);
  }

}
