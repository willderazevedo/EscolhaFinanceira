import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-various-modal',
  templateUrl: 'various-modal.html'
})
export class VariousModalPage {

  card:boolean = false;
  out:boolean  = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public viewCtrl: ViewController) {}

  modalDismiss() {
    this.viewCtrl.dismiss();
  }

  showPlots() {
    this.card = true;
  }

  hidePlots(){
    this.card = false;
  }

  showPayForm() {
    this.out = true;
  }

  hidePayForm() {
    this.out = false;
  }
}
