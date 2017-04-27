import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//Providers
import { GlobalService } from '../providers/global-service';
import { VarsService } from '../providers/vars-service';
import { DbHelper } from '../providers/db-helper';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  /**
   * Página inicial
   * @var  {Object} rootPage
   */
  rootPage:Object = this.vars.config;

  /**
   * Contrutor da classe principal do app
   * @param  {Platform}      platform     Biblioteca com informações da plataforma Android/IOs
   * @param  {DbHelper}      helper       Provider usada na criação das tabelas do banco
   * @param  {GlobalService} global       Provider usada em funções globais
   * @param  {VarsService}   vars         Provider usada em variaveis globais
   * @return {void}
   */
  constructor(platform: Platform, helper: DbHelper,
    public global: GlobalService, public vars: VarsService) {
    platform.ready().then(() => {
      helper.createDataBase();
      StatusBar.styleDefault();
      this.hideSplashScreen();
    });
  }

  /**
   * Método responsável por corrigir o erro da splash screen e dispensa-la no tempo correto
   * @return {void}
   */
  private hideSplashScreen() {
    if(Splashscreen) {
      setTimeout(()=> {
        Splashscreen.hide();
      }, 100);
    }
  }
}
