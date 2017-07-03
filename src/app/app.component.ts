import { Component } from '@angular/core';
import { Platform, MenuController, AlertController, App, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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

//Plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  /**
   * Página de configuração
   * @type {Object}
   */
  config:Object           = ConfigPage;

  /**
   * Página do painel
   * @type {Object}
   */
  panel:Object            = PanelPage;

  /**
   * Página de lançamentos diversos
   * @type {Object}
   */
  various_releases:Object = VariousReleasesPage;

  /**
   * Página de lançamentos fixos
   * @type {Object}
   */
  fixes_releases:Object   = FixesReleasesPage;

  /**
   * Página de relatório
   * @type {Object}
   */
  report:Object           = ReportPage;

  /**
   * Página de lançamentos fechados
   * @type {Object}
   */
  close_releases          = CloseReleasesPage;

  /**
   * Página de sobre app
   * @type {Object}
   */
  info                    = InfoPage;

  /**
   * Página do tutorial
   * @type {Object}
   */
  tutorial                = TutorialPage;

  /**
   * Página inicial
   * @type {Object}
   */
  rootPage:Object;

  /**
   * Construtor da classe principal do app
   * @param  {Platform}          platform     Biblioteca com informações da plataforma Android/IOs
   * @param  {DbHelper}          helper       Provider usada na criação das tabelas do banco
   * @param  {GlobalService}     global       Provider usada em funções globais
   * @param  {VarsService}       vars         Provider usada em variaveis globais
   * @param  {App}               app          Biblioteca nativa com funções do app
   * @param  {MenuController}    menu         Biblioteca nativa para controle do menu
   * @param  {AlertController}   alertCtrl    Bibioteca nativa para controle de alertas
   * @param  {LoadingController} loadCtrl     Bibioteca nativa para controle de alertas de carregamento
   * @param  {Camera}            camera       Plugin responsável pelo controle da camera do dispositivo
   * @param  {NativeStorage}     storage      Plugin responsável pelo controle do banco temporário
   * @return {void}
   */
  constructor(platform: Platform, helper: DbHelper,
  statusBar: StatusBar, splashScreen: SplashScreen,
  public global: GlobalService, public daoConfig: ConfigDAO,
  public vars: VarsService, public app: App,
  public menu: MenuController, public alertCtrl: AlertController,
  public camera: Camera, public storage: NativeStorage,
  public loadCtrl: LoadingController) {
    platform.ready().then(() => {
      helper.createDataBase();
      statusBar.backgroundColorByHexString('#216ded');
      this.backButtonHardwareAction(platform);
      this.checkConfig();
      splashScreen.hide();
      this.loadAvatar();
    });
  }

  /**
   * Adicionando evento para botão de voltar nativo (hardware)
   * @param  {Platform} platform Biblioteca com informações da plataforma Android/IOs
   * @returns {void|boolean}
   */
  private backButtonHardwareAction(platform) {
    platform.registerBackButtonAction(() => {
      let activePortal  = this.app._appRoot._modalPortal.getActive() ||
                          this.app._appRoot._overlayPortal.getActive();

      if(this.app.getActiveNav().canGoBack()) {
        this.menu.swipeEnable(true);
        this.app.getRootNav().pop();

        return false;
      }

      if(activePortal) {
        activePortal.dismiss();

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
   * @returns {boolean|void} Retorna falso ou nada
   */
  public checkConfig() {
    this.daoConfig.select(res => {
      if(res.rows.length > 0){
        this.rootPage = this.panel;
        this.global.updateConfigVars();

        return false;
      }

      this.rootPage = this.tutorial;
    });
  }

  /**
   * Método responsável por carregar o avatar escolhido pelo usuario
   * @return {void}
   */
  private loadAvatar() {
    this.storage.getItem("user_avatar").then(data => {
      this.vars.avatar = data;
    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela troca do avatar do usuário e salvar o caminho da imagem
   * no storage em base64 para cada usuario logado
   * @return {void}
   */
  public chooseAvatar() {
    let load = this.loadCtrl.create({content: "Trocando avatar..."});
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true
    };

    load.present();
    this.camera.getPicture(options).then(data => {
      let image = "data:image/jpeg;base64," + data;

      load.setContent("Salvando avatar...");
      this.storage.setItem("user_avatar", image).then((data) => {
        load.dismiss();

        this.vars.avatar = image;
      }).catch(err => {
        load.dismiss();
        this.alertCtrl.create({
          message: "Não foi possivel salvar seu avatar.",
          buttons: ["Ok"]
        }).present();
        console.log(err);
      });
    }).catch(err => {
      load.dismiss()
      console.log(err);
    });
  }
}
