import { Injectable } from '@angular/core';
import { App, ModalController } from 'ionic-angular';

@Injectable()
export class GlobalService {

  /**
   * Construtor do provider global
   * @param  {App}             publicapp       Biblioteca com as descrições do app
   * @param  {ModalController} publicmodalCtrl Biblioteca nativa para controle de modais
   * @return {void}
   */
  constructor(public app: App, public modalCtrl: ModalController){}

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

}
