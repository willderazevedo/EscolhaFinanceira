import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-panel',
  templateUrl: 'panel.html'
})
export class PanelPage {

  higher_spend:Object = [
    {label: "Celular:", value: "R$ 900.00"},
    {label: "Porcentagem:", value: "50%"},
    {label: "Forma:", value: "Avista"},
    {label: "Parcelas:", value: "Nenhuma"},
  ];

  spends_category:Object = [
    {label: "Alimentação:", value: "R$ 200,00"},
    {label: "Gasolina:", value: "R$ 180,00"},
    {label: "Emergência:", value: "R$ 200,00"},
  ];

  spends_month:Object = [
    {label: "Roupas:", value: "R$ 200,00"},
    {label: "Jogos:", value: "R$ 80,00"},
    {label: "Remédios:", value: "R$ 54,00"},
    {label: "Bebidas:", value: "R$ 24,00"},
  ];

  entries_month:Object = [
    {label: "Comissão:", value: "R$ 10,000"},
    {label: "Rajuste", value: "R$ 35,00"},
    {label: "Divida:", value: "R$ 20,00"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController) {
    this.menu.swipeEnable(true);
  }


}
