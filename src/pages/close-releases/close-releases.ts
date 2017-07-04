import { Component } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

//Data Access Object
import { ClosedFixesReleasesDao } from '../../providers/dao/closed-fixes-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';

//Providers
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-close-releases',
  templateUrl: 'close-releases.html'
})
export class CloseReleasesPage {

  /**
   * Variável resposável por guardar segmento atual
   * @type {String}
   */
  release_type     = "various";

  /**
   * Lançamentos diversos
   * @type {Array}
   */
  various_releases = [];

  /**
   * Lançamentos fixos
   * @type {Array}
   */
  fixes_releases   = [];

  /**
   * Lançamentos diversos temporário para o filtro
   * @type {Array}
   */
  temp_various     = [];

  /**
   * Lançamentos fixos temporário para o filtro
   * @type {Array}
   */
  temp_fixes       = [];

  /**
   * Construtor da classe CloseReleasesPage
   * @param {LoadingController}        loadCtrl         Biblioteca nativa para controle dos alertas de carregamento
   * @param {AlertController}          alertCtrl        Biblioteca nativa para controle dos alertas
   * @param {ClosedFixesReleasesDao}   closedFixesDao   Data Access Object dos lançementos fixos pagos
   * @param {ClosedVariousReleasesDao} closedVariousDao Data Access Object dos lançamentos diversos pagos
   * @param {VarsService}              vars             Provider para acesso de variaveis globais
   * @return {void}
   */
  constructor(public loadCtrl: LoadingController, public alertCtrl: AlertController,
  public closedFixesDao: ClosedFixesReleasesDao, public closedVariousDao: ClosedVariousReleasesDao,
  public vars: VarsService) {
    this.getClosedVariousReleases();
    this.getClosedFixesReleases();
    this.temp_various = this.various_releases;
    this.temp_fixes   = this.fixes_releases;
  }

  /**
   * Método responsável por filtrar a lista de lançamentos diversos
   * @param {any} event Descrição do envento IonInput similar ao KeyUp
   * @returns {void|number}
   */
  public filterVarious(event) {
    let searched          = event.target.value;
    this.various_releases = this.temp_various;

    if (searched && searched.trim() != '') {
      this.various_releases = this.various_releases.filter((item) => {
        return (item.CLOSED_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Método responsável por filtrar a lista de lançamentos fixos
   * @param {any} event Descrição do envento IonInput similar ao KeyUp
   * @returns {void|number}
   */
  public filterFixes(event) {
    let searched        = event.target.value;
    this.fixes_releases = this.temp_fixes;

    if (searched && searched.trim() != '') {
      this.fixes_releases = this.fixes_releases.filter((item) => {
        return (item.CLOSED_NAME.toLowerCase().indexOf(searched.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Método responsável por listar lançamentos diversos pagos
   * @returns {void}
   */
  public getClosedVariousReleases() {
    let load = this.loadCtrl.create({content:"Carregando movimentações..."});

    load.present();
    this.closedVariousDao.selectVariousCloseds(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.various_releases.push(data.rows.item(i));
      }

      load.dismiss();
    });
  }

  /**
   * Método responsável por listar lançamentos fixos pagos
   * @returns {void}
   */
  public getClosedFixesReleases() {
    this.closedFixesDao.selectFixesCloseds(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.fixes_releases.push(data.rows.item(i));
      }
    });
  }
}
