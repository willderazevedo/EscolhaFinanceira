import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  releases:Object = [
    {name: "Bebidas", value: "R$ -80,00", type: "Saída", form: "Avista", plots: "Nenhuma", color:"danger"},
    {name: "Cama", value: "R$ -900,00", type: "Saída", form: "Cartão", plots: "5x", color: "danger"},
    {name: "Divida", value: "R$ +30,00", type: "Entrada", form: "Nenhuma", plots: "Nenhuma", color: "secondary"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public global: GlobalService, public popoverCtrl: PopoverController,
  public vars: VarsService) {}

  togglePopover(event, params = {}){
    let popover = this.popoverCtrl.create(this.vars.variousPopover, params);
    popover.present({ev: event});
  }

}
