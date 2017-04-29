import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Data Access Object
import { ConfigDAO } from '../dao/config-dao';

//Providers
import { SQLite } from '@ionic-native/sqlite';
import { GlobalService } from '../providers/global-service';
import { VarsService } from '../providers/vars-service';
import { TutorialService } from '../providers/tutorial-service';
import { DbHelper } from '../providers/db-helper';

//Pages
import { ConfigPage } from '../pages/config/config';
import { PanelPage } from '../pages/panel/panel';
import { VariousReleasesPage } from '../pages/various-releases/various-releases';
import { VariousModalPage } from '../pages/various-modal/various-modal';
import { VariousPopoverPage } from '../pages/various-popover/various-popover';
import { FixesReleasesPage } from '../pages/fixes-releases/fixes-releases';
import { FixesModalPage } from '../pages/fixes-modal/fixes-modal';
import { FixesPopoverPage } from '../pages/fixes-popover/fixes-popover';
import { ReportPage } from '../pages/report/report';
import { ReportModalPage } from '../pages/report-modal/report-modal';

@NgModule({
  declarations: [
    MyApp,
    ConfigPage,
    PanelPage,
    VariousReleasesPage,
    VariousModalPage,
    VariousPopoverPage,
    FixesReleasesPage,
    FixesModalPage,
    FixesPopoverPage,
    ReportPage,
    ReportModalPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      iconMode: 'md',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      pageTransition: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConfigPage,
    PanelPage,
    VariousReleasesPage,
    VariousModalPage,
    VariousPopoverPage,
    FixesReleasesPage,
    FixesModalPage,
    FixesPopoverPage,
    ReportPage,
    ReportModalPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalService,
    SQLite,
    DbHelper,
    ConfigDAO,
    VarsService
  ]
})
export class AppModule {}
