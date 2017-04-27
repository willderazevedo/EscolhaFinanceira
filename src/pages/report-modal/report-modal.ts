import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-report-modal',
  templateUrl: 'report-modal.html'
})
export class ReportModalPage {

  outs:Object = [
    {label: "Bebidas", value: "R$ 80,00"},
    {label: "Gasolina", value: "R$ 100,00"},
    {label: "Roupas", value: "R$ 300,00"},
    {label: "Joias", value: "R$ 250,00"},
    {label: "Lanche", value: "R$ 25,00"},
    {label: "Jogos", value: "R$ 80,00"},
  ];

  entries:Object = [
    {label: "Alimentação", value: "R$ 80,00"},
    {label: "Passagens", value: "R$ 100,00"},
    {label: "Gasolina", value: "R$ 300,00"},
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) {}

  public modalDismiss() {
    this.viewCtrl.dismiss();
  }

}
