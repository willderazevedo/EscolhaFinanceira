import { Injectable } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { MenuRightPage } from '../pages/menu-right/menu-right';

@Injectable()
export class GlobalService {

  constructor(public popoverCtrl: PopoverController){}

  togglePopover(event){
    let popover = this.popoverCtrl.create(MenuRightPage);
    popover.present({ev: event});
  }

}
