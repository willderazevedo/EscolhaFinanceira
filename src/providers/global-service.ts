import { Injectable } from '@angular/core';
import { App, ModalController, PopoverController } from 'ionic-angular';

//Providers
import { VarsService } from './vars-service';

//Data Access Object
import { ConfigDAO } from '../providers/dao/config-dao';

@Injectable()
export class GlobalService {

  /**
   * Construtor do provider global
   * @param  {App}             publicapp       Biblioteca com as descrições do app
   * @param  {ModalController} publicmodalCtrl Biblioteca nativa para controle de modais
   * @return {void}
   */
  constructor(public app: App, public modalCtrl: ModalController,
  public daoConfig: ConfigDAO, public vars: VarsService,
  public popoverCtrl: PopoverController){}

  /**
   * Método responsável por toda navegação do app
   * @param  {Object} page Página de destino
   * @param  {Object} params Parametros a serem passados para a pagina de destino
   * @param  {boolean} back Tela com retorno ou nao
   * @return {void|boolean}
   */
  public pageNavigation(page = null, params = {}, back = false) {

    if(back) {
      this.app.getRootNav().push(page, params);

      return false;
    }

    this.app.getRootNav().setRoot(page, params);
  }

  /**
   * Método responsável por criar a modal
   * @param  {Object} template Página que será usada como template para a modal
   * @param  {Object} params Parametros a serem passados para a modal
   * @return {void}
   */
  public toggleModal(template, params = {}) {
    this.modalCtrl.create(template, params).present();
  }

  /**
   * Método responsável por criar a popover
   * @param  {Object} event Informação sobre o elemento
   * @param  {Object} template Página que será usada como template para a modal
   * @param  {Object} params Parametros a serem passados para a modal
   * @return {void}
   */
  public togglePopover(event, template, params = {}){
    this.popoverCtrl.create(template, params).present({ev: event});
  }

  /**
   * Método responsável por atualizar (refresh) a pagina
   * @return {void}
   */
  public refreshPage() {
    this.app.getRootNav().setRoot(this.app.getActiveNav().getActive().component);
  }

  /**
   * Método responsável buscar configurações do usuário
   * @return {void}
   */
  public updateConfigVars() {
    this.daoConfig.select(res => {
      if(res.rows.length > 0){

        var data         = res.rows.item(0);
        this.vars.name   = data.USER_NAME;
        this.vars.income = data.USER_INCOME.toFixed(2);
      }
    });
  }
}
