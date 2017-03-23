import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';

@Injectable()
export class GlobalService {


  constructor(public app: App){}

  pageNavigation(page, params = {}, back = false) {

    if(back)
      this.app.getRootNav().push(page, params);
    else
      this.app.getRootNav().setRoot(page, params);
  }

}
