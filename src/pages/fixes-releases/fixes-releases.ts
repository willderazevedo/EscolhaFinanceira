import { Component } from '@angular/core';
import { PopoverController, ModalController, LoadingController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';
import { ClosedFixesReleasesDao } from '../../providers/dao/closed-fixes-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';

//Template Pages
import { FixesModalPage } from '../fixes-modal/fixes-modal';
import { FixesPopoverPage } from '../fixes-popover/fixes-popover';

@Component({
  selector: 'page-fixes-releases',
  templateUrl: 'fixes-releases.html'
})
export class FixesReleasesPage {

  /**
   * Modal de fixos
   * @type {Object}
   */
  fixesModal        = FixesModalPage;

  /**
   * Variável resposável por guardar segmento atual
   * @type {String}
   */
  releases_type     = "out";

  /**
   * Lançamentos diversos de saída
   * @type {Array}
   */
  releases_out      = [];

  /**
   * Lançamentos diversos de entrada
   * @type {Array}
   */
  releases_in       = [];

  /**
   * Lançamentos diversos de saída temporário para filtro
   * @type {Array}
   */
  temp_releases_out = [];

  /**
   * Lançamntos diversos de entrada temporário para filtro
   * @type {Array}
   */
  temp_releases_in  = [];

  /**
   * Construtor da classe FixesReleasesPage
   * @param {PopoverController}      popoverCtrl Biblioteca nativa para controle da popover
   * @param {ModalController}        modalCtrl   Biblioteca nativa para controle das modais
   * @param {LoadingController}      loadCtrl    Biblioteca nativa para controle dos alertas de carregamento
   * @param {GlobalService}          global      Provider responsável pelas fuções globais
   * @param {FixesReleasesDAO}       fixesDao    Data Access Object de lançamentos fixos
   * @param {ClosedFixesReleasesDao} closeFixes  Data Access Object de lançamentos fixos pagos
   */
  constructor(public popoverCtrl: PopoverController, public modalCtrl: ModalController,
  public global: GlobalService, public loadCtrl: LoadingController,
  public fixesDao: FixesReleasesDAO, public closeFixes: ClosedFixesReleasesDao) {
    this.getFixesReleasesOut();
    this.getFixesReleasesIn();
    this.temp_releases_out = this.releases_out;
    this.temp_releases_in  = this.releases_in;
  }

  /**
   * Método responsável por filtrar os lançamentos fixos de saída
   * @param {any} event Informações do evento IonInput similar ao KeyUp
   * @returns {void|number}
   */
  public filterFixesOut(event) {
    let searched      = event.target.value;
    this.releases_out = this.temp_releases_out;

    if (searched && searched.trim() != '') {
      this.releases_out = this.releases_out.filter((item) => {
        return (item.FIXES_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Método responsável por filtrar os lançamentos fixos de entrada
   * @param {any} event Informações do evento IonInput similar ao KeyUp
   * @returns {void|number}
   */
  public filterFixesIn(event) {
    let searched      = event.target.value;
    this.releases_in = this.temp_releases_in;

    if (searched && searched.trim() != '') {
      this.releases_in = this.releases_in.filter((item) => {
        return (item.FIXES_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Método responsávl pela listagem dos lançamentos fixos de saída
   * @returns {void}
   */
  public getFixesReleasesOut() {
    let load = this.loadCtrl.create({content:"Carregando lançamentos..."}) ;

    load.present();
    this.fixesDao.selectFixesOut("", data => {
      let length        = data.rows.length;
      let fixesReleases = data;

      for(let i = 0;i < length;i++) {
        this.closeFixes.haveClosedInThisMonth(fixesReleases.rows.item(i).FIXES_ID, data => {

          this.releases_out.push(fixesReleases.rows.item(i));
          this.releases_out[i]["collapse"] = true;
          this.releases_out[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }

      load.dismiss();
    });
  }

  /**
   * Método responsávl pela listagem dos lançamentos fixos de entrada
   * @returns {void}
   */
  public getFixesReleasesIn() {
    this.fixesDao.selectFixesIn("", data => {
      let length        = data.rows.length;
      let fixesReleases = data;

      for(let i = 0;i < length;i++) {
        this.closeFixes.haveClosedInThisMonth(fixesReleases.rows.item(i).FIXES_ID, data => {

          this.releases_in.push(fixesReleases.rows.item(i));
          this.releases_in[i]["collapse"] = true;
          this.releases_in[i]["avaible"]  = data.rows.length > 0 ? false : true;
        });
      }
    });
  }

  /**
   * Método responsável pela criação da popover de cada lançamento e refresh da listagem
   * @param {any}    event  Informações do evento de Tap similar ao Click
   * @param {Object} params Informações do lançamento escolhido
   * @returns {void|boolean}
   */
  public togglePopover(event, params = {}){
    event.stopPropagation();

    let popover = this.popoverCtrl.create(FixesPopoverPage, params);

    popover.present({ev: event});
    popover.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getFixesReleasesOut();
      this.getFixesReleasesIn();
    });
  }

  /**
   * Método responsável pela criação da modal de atualização de cada lançamento e refresh da listagem
   * @returns {void|boolean}
   */
  public toggleModal() {
    let modal = this.modalCtrl.create(this.fixesModal);

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.releases_out = [];
      this.releases_in  = [];
      this.getFixesReleasesOut();
      this.getFixesReleasesIn();
    });
  }
}
