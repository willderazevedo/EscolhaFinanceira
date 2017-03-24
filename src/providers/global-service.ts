import { Injectable } from '@angular/core';
import { App, ModalController } from 'ionic-angular';

@Injectable()
export class GlobalService {


  constructor(public app: App, public modalCtrl: ModalController){}

  pageNavigation(page = null, params = {}, back = false) {

    if(back)
      this.app.getRootNav().push(page, params);
    else
      this.app.getRootNav().setRoot(page, params);
  }

  toggleModal(template, params = {}) {
    let modal = this.modalCtrl.create(template, params);
    modal.present();
  }

}
