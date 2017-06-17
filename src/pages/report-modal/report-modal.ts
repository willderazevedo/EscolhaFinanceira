import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController } from 'ionic-angular';

//Data Access Object
import { ReportDao } from '../../providers/dao/report-dao';

@Component({
  selector: 'page-report-modal',
  templateUrl: 'report-modal.html'
})
export class ReportModalPage {

  /**
   * Filtros do relatório
   * @type {Object}
   */
  filters     = this.navParams.get('filters');

  /**
   * Resultados do relatório
   * @type {Array}
   */
  report_data = [];

  /**
   * Somátorio dos lançamentos
   * @type {Float}
   */
  total       = 0;

  /**
   * Construtor da classe ReportModalPage
   * @param {NavParams}         navParams Biblioteca nativa responsável por recuperar os parâmentros passados por outras páginas
   * @param {ViewController}    viewCtrl  Biblioteca nativa responsável pelo controle das views
   * @param {LoadingController} loadCtrl  Biblioteca nativa responsável pelo controle de alertas
   * @param {ReportDao}         reportDao Data Access Object do relatório
   */
  constructor(public navParams: NavParams, public viewCtrl: ViewController,
  public reportDao: ReportDao, public loadCtrl: LoadingController) {
    this.buildReport();
  }

  /**
   * Método responsável pela construção do relatório aberto ou fechado
   * @returns {void|boolean}
   */
  public buildReport() {
    if (this.filters.type == 1) {
      this.getOpenReleasesReport();

      return false;
    }

    this.getClosedReleasesReport();
  }

  /**
   * Método responsável por construir o relatório com lançamentos abertos
   * @returns {void}
   */
  private getOpenReleasesReport() {

    let load = this.loadCtrl.create({content: "Construindo relatório..."});

    this.reportDao.selectOpenReleases(this.filters, (res) => {
      let length = res.rows.length;
      let total  = 0;

      for(var i = 0;i < length;i++) {
        this.report_data.push(res.rows.item(i));

        if(this.filters.category == 1) {
          total += this.report_data[i].VARIOUS_VALUE;
        }else{
          total += this.report_data[i].FIXES_VALUE;
        }
      }

      this.total = total;

      load.dismiss();
    });
  }

  /**
   * Método responsável por construir o relatório com lançamentos fechados
   * @returns {void}
   */
  private getClosedReleasesReport() {
    let load = this.loadCtrl.create({content: "Construindo relatório..."});

    this.reportDao.selectClosedReleases(this.filters, (res) => {
      let length = res.rows.length;
      let total  = 0;

      for(var i = 0;i < length;i++) {
        this.report_data.push(res.rows.item(i));

        total += this.report_data[i].CLOSED_VALUE;
      }

      this.total = total;

      load.dismiss();
    });
  }

  /**
   * Método responsável por fechar a modal
   * @returns {void}
   */
  public modalDismiss() {
    this.viewCtrl.dismiss();
  }

}
