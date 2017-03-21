import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Providers
import { GlobalService } from '../providers/global-service';

//Pages
import { MenuRightPage } from '../pages/menu-right/menu-right';
import { ConfigPage } from '../pages/config/config';
import { PanelPage } from '../pages/panel/panel';

@NgModule({
  declarations: [
    MyApp,
    ConfigPage,
    PanelPage,
    MenuRightPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ConfigPage,
    PanelPage,
    MenuRightPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalService
  ]
})
export class AppModule {}
