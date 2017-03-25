import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { FixesModalPage } from '../fixes-modal/fixes-modal';
import { FixesPopoverPage } from '../fixes-popover/fixes-popover';

@Component({
  selector: 'page-fixes-releases',
  templateUrl: 'fixes-releases.html'
})
export class FixesReleasesPage {

  fixesModal:Object = FixesModalPage;

  releases:Object = [
    {name: "Alimentação", value: "R$ -300,00", type: "Saída", color:"danger"},
    {name: "Passagem", value: "R$ -150,00", type: "Saída", color: "danger"},
    {name: "Reajuste", value: "R$ +50,00", type: "Entrada", color: "secondary"},
    {name: "Reajuste", value: "R$ +50,00", type: "Entrada", color: "secondary"},
    {name: "Reajuste", value: "R$ +50,00", type: "Entrada", color: "secondary"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, public modalCtrl: ModalController,
    public global: GlobalService) {}

  togglePopover(event, params = {}){
    let popover = this.popoverCtrl.create(FixesPopoverPage, params);
    popover.present({ev: event});
  }

}
