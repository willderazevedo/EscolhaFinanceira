import { Injectable } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Injectable()
export class GlobalService {

  constructor(public popoverCtrl: PopoverController){}

}
