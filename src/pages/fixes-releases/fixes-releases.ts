import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';


@Component({
  selector: 'page-fixes-releases',
  templateUrl: 'fixes-releases.html'
})
export class FixesReleasesPage {

  releases:Object = [
    {name: "Alimentação", value: "R$ -300,00", type: "Saída", color:"danger"},
    {name: "Passagem", value: "R$ -150,00", type: "Saída", color: "danger"},
    {name: "Reajuste", value: "R$ +50,00", type: "Entrada", color: "secondary"},
    {name: "Reajuste", value: "R$ +50,00", type: "Entrada", color: "secondary"},
    {name: "Reajuste", value: "R$ +50,00", type: "Entrada", color: "secondary"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, public modalCtrl: ModalController,
    public global: GlobalService, public vars: VarsService) {}

  public togglePopover(event, params = {}){
    let popover = this.popoverCtrl.create(this.vars.fixesPopover, params);
    popover.present({ev: event});
  }

}
