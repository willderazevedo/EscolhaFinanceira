import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-panel',
  templateUrl: 'panel.html'
})
export class PanelPage {

  higher_spend:Object = [
    {label: "Celular:", value: "R$ 900.00" , color: "danger"},
    {label: "Porcentagem:", value: "50%", color: ""},
    {label: "Forma:", value: "Avista", color: ""},
    {label: "Parcelas:", value: "Nenhuma", color: ""},
  ];

  spends_category:Object = [
    {label: "Alimentação:", value: "R$ -200,00", color: "danger"},
    {label: "Gasolina:", value: "R$ -180,00", color: "danger"},
    {label: "Emergência:", value: "R$ -200,00", color: "danger"},
  ];

  spends_month:Object = [
    {label: "Roupas:", value: "R$ -200,00", color: "danger"},
    {label: "Jogos:", value: "R$ -80,00", color: "danger"},
    {label: "Remédios:", value: "R$ -54,00", color: "danger"},
    {label: "Bebidas:", value: "R$ -24,00", color: "danger"},
    {label: "Comissão:", value: "R$ +10,000", color: "secondary"},
    {label: "Rajuste", value: "R$ +35,00", color: "secondary"},
    {label: "Divida:", value: "R$ +20,00", color: "secondary"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController, public global: GlobalService,
  public vars: VarsService) {
    this.menu.swipeEnable(true);
  }

}
