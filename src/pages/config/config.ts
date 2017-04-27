import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ViewController, LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { ConfigDAO } from '../../dao/config-dao';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  /**
   * Informações do usuário
   * @var {Obeject} user
   */
  user  = {
    name: "",
    income: null,
    income_day: ""
  };

  /**
   * [constructor description]
   * @param  {NavController}     navCtrl   Controle de navegação
   * @param  {NavParams}         navParams Parametros passados para a pagina atual
   * @param  {MenuController}    menu      Controle do menu lateral
   * @param  {GlobalService}     global    Provider com funções globais
   * @param  {ViewController}    viewCtrl  Controle da pagina atual
   * @param  {LoadingController} loadCtrl  Controle do alerta de load
   * @param  {AlertController}   alertCtrl Controle do alerta
   * @param  {ConfigDAO}         dao       Data Access Object de config
   * @param  {VarsService}       vars      Provider de variaveis globais
   * @return {void}
   */
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController, public global: GlobalService,
  public viewCtrl: ViewController, public loadCtrl: LoadingController,
  public alertCtrl: AlertController, public dao: ConfigDAO,
  public vars: VarsService) {
    this.menu.swipeEnable(false);
  }

  /**
   * Método nativo resposavel por executar uma ação apos o carregamento da pagina
   * @return {void}
   */
  ionViewDidLoad() {
    this.viewCtrl.getNavbar().backButtonClick = () => {
      this.menu.swipeEnable(true);
      this.navCtrl.pop();
    }
  }

  /**
   * Método resposavel pela gravação/atualização do usuario no app
   * @param  {boolean} update Indica se realizara um update ou um insert
   * @return {void}
   */
  public saveConfig(update = false) {

    let load = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.dao.insert(this.user, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          title: "Erro",
          message: "Não foi possível salvar as configurações!"
        }).present();

        return false;
      }

      this.global.pageNavigation(this.vars.panel);
    });
  }

}
