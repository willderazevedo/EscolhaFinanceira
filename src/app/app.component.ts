import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//Providers
import { GlobalService } from '../providers/global-service';
import { DbHelper } from '../providers/db-helper';

//Pages
import { ConfigPage } from '../pages/config/config';
import { PanelPage } from '../pages/panel/panel';
import { VariousReleasesPage } from '../pages/various-releases/various-releases';
import { FixesReleasesPage } from '../pages/fixes-releases/fixes-releases';
import { ReportPage } from '../pages/report/report';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  config:Object           = ConfigPage;
  panel:Object            = PanelPage;
  various_releases:Object = VariousReleasesPage;
  fixes_releases:Object   = FixesReleasesPage;
  report:Object           = ReportPage;
  rootPage:Object         = this.config;

  constructor(platform: Platform, helper: DbHelper, public global: GlobalService) {
    platform.ready().then(() => {
      helper.createDataBase();
      StatusBar.styleDefault();
      this.hideSplashScreen();
    });
  }

  private hideSplashScreen() {
    if(Splashscreen) {
      setTimeout(()=> {
        Splashscreen.hide();
      }, 100);
    }
  }
}
