import { Component } from '@angular/core';
import { Platform, App, MenuController, AlertController } from 'ionic-angular';
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
import { CloseReleasesPage } from '../pages/close-releases/close-releases';
import { InfoPage } from '../pages/info/info';
import { TutorialPage } from '../pages/tutorial/tutorial';

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
   * Página de lançamentos fechados
   * @var  {Object} close_releases
   */
  close_releases          = CloseReleasesPage;

  /**
   * Página de sobre app
   * @var  {Object} info
   */
  info                    = InfoPage;

  /**
   * Página do tutorial
   * @var  {Object} tutorial
   */
  tutorial                = TutorialPage;

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
  public vars: VarsService, public app: App,
  public menu: MenuController, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      helper.createDataBase();
      StatusBar.styleDefault();
      this.backButtonHardwareAction(platform);
      this.hideSplashScreen();
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
   * Adicionando evento para botão de voltar nativo
   * @param  {Platform} platform Biblioteca com informações da plataforma Android/IOs
   * @return {void}
   */
  private backButtonHardwareAction(platform) {
    platform.registerBackButtonAction(() => {
      if(this.app.getActiveNav().canGoBack()) {
        this.menu.swipeEnable(true);
        this.app.getRootNav().pop();

        return false;
      }

      this.alertCtrl.create({
        message: "Você deseja mesmo sair?",
        buttons: [
          {
            text: "Não"
          },
          {
            text: "Sim",
            handler: () => {
              platform.exitApp();
            }
          }
        ]
      }).present();
    });
  }

  /**
   * Método responsável pela checagem da configuração existente
   * @return {boolean|void} Retorna falso ou nada
   */
  public checkConfig() {
    this.daoConfig.select(res => {
      if(res.rows.length > 0){
        this.rootPage = this.panel;
        this.global.updateConfigVars();
        this.hideSplashScreen();

        return false;
      }

      this.rootPage = this.tutorial;
      this.hideSplashScreen();
    });
  }
}
