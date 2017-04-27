import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

//Providers
import { VarsService } from './vars-service';

@Injectable()
export class TutorialService {

  constructor(public alertCtrl: AlertController, public vars: VarsService) {}
}
