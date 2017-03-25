import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { VariousModalPage } from '../various-modal/various-modal';
import { VariousPopoverPage } from '../various-popover/various-popover';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  variousModal:Object = VariousModalPage;

  releases:Object = [
    {name: "Bebidas", value: "R$ -80,00", type: "Saída", form: "Avista", plots: "Nenhuma", color:"danger"},
    {name: "Cama", value: "R$ -900,00", type: "Saída", form: "Cartão", plots: "5x", color: "danger"},
    {name: "Divida", value: "R$ +30,00", type: "Entrada", form: "Nenhuma", plots: "Nenhuma", color: "secondary"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService, public popoverCtrl: PopoverController) {}

  togglePopover(event, params = {}){
    let popover = this.popoverCtrl.create(VariousPopoverPage, params);
    popover.present({ev: event});
  }

}
