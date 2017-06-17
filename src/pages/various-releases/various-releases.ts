import { Component } from '@angular/core';
import { PopoverController, AlertController, LoadingController, ModalController } from 'ionic-angular';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';

//Template Pages
import { VariousModalPage } from '../various-modal/various-modal';
import { VariousPopoverPage } from '../various-popover/various-popover';

@Component({
  selector: 'page-various-releases',
  templateUrl: 'various-releases.html'
})
export class VariousReleasesPage {

  /**
   * Modal de lançamentos diversos
   * @type {Object}
   */
  variousModal      = VariousModalPage;

  /**
   * Variável que controla o segmento atual
   * @type {String}
   */
  releases_type     = "out";

  /**
   * Lançaments diversos de saída
   * @type {Array}
   */
  releases_out      = [];

  /**
   * Lançamentos diversos de entrada
   * @type {Array}
   */
  releases_in       = [];

  /**
   * Lançamentos diversos de saída temporários
   * @type {Array}
   */
  temp_releases_out = [];

  /**
   * Lançamentos diversos de entrada temporários
   * @type {Array}
   */
  temp_releases_in  = [];

  /**
   * Construtor da classe VariousReleasesPage
   * @param {PopoverController}        popoverCtrl   Biblioteca nativa responsável pelo controle de popovers
   * @param {AlertController}          alertCtrl     Biblioteca nativa responsável pelo controle de alertas
   * @param {LoadingController}        loadCtrl      Biblioteca nativa responsável pelo controle de alertas de carregamento
   * @param {ModalController}          modalCtrl     Biblioteca nativa responsável pelo controle de modais
   * @param {VariousReleasesDAO}       variousDao    Data Access Object de lançamentos diversos
   * @param {ClosedVariousReleasesDao} closedVarious Data Access Object de lançamentos diversos fechados
   */
  constructor(public popoverCtrl: PopoverController, public alertCtrl: AlertController,
  public loadCtrl: LoadingController, public modalCtrl: ModalController,
  public variousDao: VariousReleasesDAO, public closedVarious: ClosedVariousReleasesDao) {
    this.getVariousReleasesOut();
    this.getVariousReleasesIn();
    this.temp_releases_out = this.releases_out;
    this.temp_releases_in  = this.releases_in;
  }

  /**
   * Método responsáel pela filtragem dos lançamentos diversos de saída
   * @param {any} event Informações do evento IonInput similar ao KeyUp
   * @returns {void|number}
   */
  public filterVariousOut(event) {
    let searched      = event.target.value;
    this.releases_out = this.temp_releases_out;

    if (searched && searched.trim() != '') {
      this.releases_out = this.releases_out.filter((item) => {
        return (item.VARIOUS_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Método responsáel pela filtragem dos lançamentos diversos de entrada
   * @param {any} event Informações do evento IonInput similar ao KeyUp
   * @returns {void|number}
   */
  public filterVariousIn(event) {
    let searched      = event.target.value;
    this.releases_in = this.temp_releases_in;

    if (searched && searched.trim() != '') {
      this.releases_in = this.releases_in.filter((item) => {
        return (item.VARIOUS_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Método responsável por listar o lançamentos diversos de saída
   * @returns {void}
   */
  public getVariousReleasesOut() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.variousDao.selectVariousOut("", data => {
      let length          = data.rows.length;
      let variousReleases = data;

      for(let i = 0;i < length;i++) {
        this.closedVarious.haveClosedInThisMonth(variousReleases.rows.item(i).VARIOUS_ID, data => {

          this.releases_out.push(variousReleases.rows.item(i));
          this.releases_out[i]["collapse"] = true;
          this.releases_out[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }

      load.dismiss();
    });
  }

  /**
   * Método responsável por listar o lançamentos diversos de entrada
   * @returns {void}
   */
  public getVariousReleasesIn() {
    this.variousDao.selectVariousIn("", data => {
      let length = data.rows.length;
      let variousReleases = data;

      for(let i = 0;i < length;i++) {
        this.closedVarious.haveClosedInThisMonth(variousReleases.rows.item(i).VARIOUS_ID, data => {

          this.releases_in.push(variousReleases.rows.item(i));
          this.releases_in[i]["collapse"] = true;
          this.releases_in[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }
    });
  }

  /**
   * Método responsável por criar a modal para cada lançamento e seus respectivos dados e atualizar listagem
   * @param {any} event  Informações do evento Tap similar ao Click
   * @param {Object} params Informações do lançamento
   * @returns {void|boolean}
   */
  public togglePopover(event, params = {}){
    event.stopPropagation();

    let popover = this.popoverCtrl.create(VariousPopoverPage, params);

    popover.present({ev: event});
    popover.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getVariousReleasesOut();
      this.getVariousReleasesIn();
    });
  }

  /**
   * Método responsável por criar modal de edição do lançamento e atualizar listagem dos lançamentos
   * @returns {void|boolean}
   */
  public toggleModal() {
    let modal = this.modalCtrl.create(this.variousModal);

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getVariousReleasesOut();
      this.getVariousReleasesIn();
    });
  }
}
