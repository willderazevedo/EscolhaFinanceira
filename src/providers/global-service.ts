import { Injectable } from '@angular/core';
import { PopoverController, App } from 'ionic-angular';

@Injectable()
export class GlobalService {

  constructor(public popoverCtrl: PopoverController, public app: App){}

  pageNavigation(page, params = {}, back = false) {

    if(back)
      return this.app.getRootNav().push(page, params);
    else
      return this.app.getRootNav().setRoot(page, params);
  }

}
