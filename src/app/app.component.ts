import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//Providers
import { GlobalService } from '../providers/global-service';
import { DbHelper } from '../providers/db-helper';
import { VarsService } from '../providers/vars-service';

//Data Access Object
import { ConfigDAO } from '../providers/dao/config-dao';

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

  /**
   * Página de configuração
   * @var  {Object} config
   */
  config:Object           = ConfigPage;

  /**
   * Página do painel
   * @var  {Object} panel
   */
  panel:Object            = PanelPage;

  /**
   * Página de lançamentos diversos
   * @var  {Object} various_releases
   */
  various_releases:Object = VariousReleasesPage;

  /**
   * Página de lançamentos fixos
   * @var  {Object} fixes_releases
   */
  fixes_releases:Object   = FixesReleasesPage;

  /**
   * Página de relatório
   * @var  {Object} report
   */
  report:Object           = ReportPage;

  /**
   * Página inicial
   * @var  {Object} rootPage
   */
  rootPage:Object;

  /**
   * Contrutor da classe principal do app
   * @param  {Platform}      platform     Biblioteca com informações da plataforma Android/IOs
   * @param  {DbHelper}      helper       Provider usada na criação das tabelas do banco
   * @param  {GlobalService} global       Provider usada em funções globais
   * @param  {VarsService}   vars         Provider usada em variaveis globais
   * @return {void}
   */
  constructor(platform: Platform, helper: DbHelper,
  public global: GlobalService, public daoConfig: ConfigDAO,
  public vars: VarsService) {
    platform.ready().then(() => {
      helper.createDataBase();
      StatusBar.styleDefault();
      this.checkConfig();
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

  /**
   * Método responsável pela checagem da configuração existente
   * @return {boolean|void} Retorna falso ou nada
   */
  public checkConfig() {
    this.daoConfig.select(res => {
      if(res.rows.length > 0){
        this.rootPage = this.panel;
        this.global.getWallet();
        this.hideSplashScreen();

        return false;
      }

      this.rootPage = this.config;
      this.hideSplashScreen();
    });
  }
}
