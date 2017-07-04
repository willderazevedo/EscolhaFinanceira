import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ViewController, LoadingController, ToastController } from 'ionic-angular';

//Data Access Object
import { ConfigDAO } from '../../providers/dao/config-dao';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

//Pages
import { PanelPage } from '../panel/panel';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  /**
   * Identificador se a tela está em modo de update ou nao
   * @type {boolean}
   */
  update = this.navParams.get('update') ? true : false;

  /**
   * Página do painel
   * @type {Object}
   */
  panel  = PanelPage;

  /**
   * Informações do usuário
   * @type {Obeject}
   */
  user   = {
    name: "",
    income: null,
  };

  /**
   * Construtor da classe ConfigPage
   * @param  {NavController}     navCtrl   Controle de navegação
   * @param  {NavParams}         navParams Parametros passados para a pagina atual
   * @param  {MenuController}    menu      Controle do menu lateral
   * @param  {GlobalService}     global    Provider com funções globais
   * @param  {ViewController}    viewCtrl  Controle da pagina atual
   * @param  {LoadingController} loadCtrl  Controle do alerta de load
   * @param  {ToastController}   toastCtrl Controle do toast
   * @param  {ConfigDAO}         dao       Data Access Object de config
   * @param {VarsService}              vars             Provider para acesso de variaveis globais
   * @return {void}
   */
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController, public global: GlobalService,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public toastCtrl: ToastController, public dao: ConfigDAO,
  public vars: VarsService) {
    this.menu.swipeEnable(false);
    this.getConfig();
  }

  /**
   * Adicionando evento para botão de navegação push
   * @returns {void}
   */
  public backButtonAction() {
    this.menu.swipeEnable(true);
    this.navCtrl.pop();
  }

  /**
   * Método resposavel pela gravação do usuario no app
   * @returns {void}
   */
  public saveConfig() {

    let load = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.dao.insert(this.user, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.toastCtrl.create({
          position: "bottom",
          message: "Não foi possível salvar as configurações!",
          duration: 2000
        }).present();

        return false;
      }

      this.global.updateConfigVars();
      this.global.pageNavigation(this.panel);
    });
  }

  /**
   * Método resposavel pela atualização do usuario no app
   * @returns {void|boolean}
   */
  public updateConfig() {

    let load = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.dao.update(this.user, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.toastCtrl.create({
          position: "bottom",
          message: "Não foi possível salvar as configurações!",
          duration: 2000
        }).present();

        return false;
      }

      this.global.updateConfigVars();

      this.toastCtrl.create({
        position: "bottom",
        message: "Configurações atualizadas!",
        duration: 1500
      }).present();

      this.menu.swipeEnable(true);
      this.navCtrl.pop();
    });
  }

  /**
   * Método responsável por colocar configurações nos campos
   * @returns {boolean|void} Retorna falso ou nada
   */
  public getConfig() {

    if(!this.update){
      return false;
    }

    this.dao.select(res => {
      if(res.rows.length > 0){

        var data             = res.rows.item(0);
        this.user.name       = data.USER_NAME;
        this.user.income     = data.USER_INCOME;
      }
    });
  }

}
