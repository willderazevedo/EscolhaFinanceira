import { Component } from '@angular/core';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

//TemplatePages
import { ReportModalPage } from '../report-modal/report-modal';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  /**
   * Página de resultado do relatório
   * @type {Object}
   */
  reportModal       = ReportModalPage;

  /**
   * Data máxima para escolher no relatório
   * @type {Date}
   */
  maxDate           = new Date(new Date().setFullYear(new Date().getFullYear() + 5));

  /**
   * Data atual
   * @type {Date}
   */
  actualDate        = new Date();

  /**
   * Data de amamnhã
   * @type {Date}
   */
  tomorrowDate      = new Date(new Date().setDate(new Date().getDate() + 1));

  /**
   * Filtros do relatório
   * @type {Object}
   */
  report_properties = {
    beginDate: this.actualDate.toISOString(),
    finalDate: this.tomorrowDate.toISOString(),
    type: 1,
    category: 1,
    release_type: 1,
    pay_form: 1,
  };

  /**
   * Construtor da classe ReportPage
   * @param {GlobalService} global Provider responsável pelas funções globais
   * @param {VarsService}   vars             Provider para acesso de variaveis globais
   * @return {void}
   */
  constructor(public global: GlobalService, public vars: VarsService) {}

  /**
   * Método responsável por abrir a modal passando os filtros
   * @returns {void}
   */
  public makeReport() {
    this.global.toggleModal(this.reportModal, { filters: this.report_properties });
  }

  /**
   * Método resposável por mudar a data inicial de acordo com a final
   * @returns {void|boolean}
   */
  public changeBeginPeriod() {
    let beginDate     = new Date(this.report_properties.beginDate);
    let finalDate     = new Date(this.report_properties.finalDate);
    let yesterdayDate = new Date(new Date(finalDate).setDate(finalDate.getDate() - 1));

    if(finalDate > beginDate) {
      return false;
    }

    this.report_properties.beginDate = yesterdayDate.toISOString();
  }

  /**
   * Método resposável por mudar a data final de acordo com a inicial
   * @returns {void|boolean}
   */
  public changeFinalPeriod() {
    let beginDate    = new Date(this.report_properties.beginDate);
    let finalDate    = new Date(this.report_properties.finalDate);
    let tomorrowDate = new Date(new Date(beginDate).setDate(beginDate.getDate() + 1));

    if(beginDate < finalDate) {
      return false;
    }

    this.report_properties.finalDate = tomorrowDate.toISOString();
  }

}
