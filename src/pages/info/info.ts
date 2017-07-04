import { Component } from '@angular/core';

//Providers
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  constructor(public vars: VarsService) {}

}
