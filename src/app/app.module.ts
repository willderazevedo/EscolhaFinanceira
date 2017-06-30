import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//Data Access Object
import { ConfigDAO } from '../providers/dao/config-dao';
import { VariousReleasesDAO } from '../providers/dao/various-releases-dao';
import { FixesReleasesDAO } from '../providers/dao/fixes-releases-dao';
import { ClosedFixesReleasesDao } from '../providers/dao/closed-fixes-releases-dao';
import { ClosedVariousReleasesDao } from '../providers/dao/closed-various-releases-dao';
import { ReportDao } from '../providers/dao/report-dao';

//Providers
import { SQLite } from '@ionic-native/sqlite';
import { GlobalService } from '../providers/global-service';
import { VarsService } from '../providers/vars-service';
import { TotoroBotService } from '../providers/totoro-bot-service';
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
import { CloseReleasesPage } from '../pages/close-releases/close-releases';
import { InfoPage } from '../pages/info/info';
import { TutorialPage } from '../pages/tutorial/tutorial';

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
    CloseReleasesPage,
    InfoPage,
    TutorialPage
  ],
  imports: [
    BrowserModule,
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
    ReportModalPage,
    CloseReleasesPage,
    InfoPage,
    TutorialPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalService,
    SQLite,
    DbHelper,
    ConfigDAO,
    VariousReleasesDAO,
    FixesReleasesDAO,
    ClosedFixesReleasesDao,
    ClosedVariousReleasesDao,
    ReportDao,
    VarsService,
    TotoroBotService
  ]
})
export class AppModule {}
