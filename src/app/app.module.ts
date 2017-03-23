import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Providers
import { GlobalService } from '../providers/global-service';

//Pages
import { ConfigPage } from '../pages/config/config';
import { PanelPage } from '../pages/panel/panel';
import { VariousReleasesPage } from '../pages/various-releases/various-releases';

@NgModule({
  declarations: [
    MyApp,
    ConfigPage,
    PanelPage,
    VariousReleasesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConfigPage,
    PanelPage,
    VariousReleasesPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalService
  ]
})
export class AppModule {}
