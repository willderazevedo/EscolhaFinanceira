import { Injectable } from '@angular/core';
import { App, ModalController } from 'ionic-angular';

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
  public daoConfig: ConfigDAO, public vars: VarsService){}

  /**
   * Método responsável por toda navegação do app
   * @param  {Object} page Página de destino
   * @param  {Object} params Parametros a serem passados para a pagina de destino
   * @param  {boolean} back Tela com retorno ou nao
   * @return {void}
   */
  public pageNavigation(page = null, params = {}, back = false) {

    if(back)
      this.app.getRootNav().push(page, params);
    else
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
   * Método responsável por atualizar a pagina
   * @return {void}
   */
  public refreshPage() {
    this.app.getRootNav().setRoot(this.app.getActiveNav().getActive().component);
  }

  /**
   * Método responsável buscar valor na carteira
   * @return {void}
   */
  public updateConfigVars() {
    this.daoConfig.select(res => {
      if(res.rows.length > 0){

        var data         = res.rows.item(0);
        this.vars.wallet = data.USER_WALLET.toFixed(2);
        this.vars.name   = data.USER_NAME;
      }
    });
  }

}
