import { Injectable } from '@angular/core';

// //Pages
import { ConfigPage } from '../pages/config/config';
import { PanelPage } from '../pages/panel/panel';
import { VariousReleasesPage } from '../pages/various-releases/various-releases';
import { FixesReleasesPage } from '../pages/fixes-releases/fixes-releases';
import { ReportPage } from '../pages/report/report';

//Template Pages
import { FixesModalPage } from '../pages/fixes-modal/fixes-modal';
import { FixesPopoverPage } from '../pages/fixes-popover/fixes-popover';
import { VariousModalPage } from '../pages/various-modal/various-modal';
import { VariousPopoverPage } from '../pages/various-popover/various-popover';
import { ReportModalPage } from '../pages/report-modal/report-modal';

@Injectable()
export class VarsService {

  /**
   * Nome do banco de dados
   * @var {string} DBNAME
   */
  public DBNAME     = "escolhafinanceira.db";

  /**
   * Caminho do banco de dados
   * @var {string} DBLOCATION
   */
  public DBLOCATION = "default";

  /**
   * Página de configuração
   * @var  {Object} config
   */
  config:Object           = ConfigPage;

  /**
   * Página do painel
   * @var  {Object} panel
   */
  panel:Object            = PanelPage;

  /**
   * Página de lançamentos diversos
   * @var  {Object} various_releases
   */
  various_releases:Object = VariousReleasesPage;

  /**
   * Página de lançamentos fixos
   * @var  {Object} fixes_releases
   */
  fixes_releases:Object   = FixesReleasesPage;

  /**
   * Template da modal de lançamentos fixos
   * @var  {Object} fixesModal
   */
  fixesModal:Object = FixesModalPage;

  /**
   * Template do popover de lançamentos fixos
   * @var  {Object} fixesPopover
   */
  fixesPopover:Object = FixesPopoverPage;

  /**
   * Template da modal de lançamentos diversos
   * @var  {Object} fixesModal
   */
  variousModal:Object = VariousModalPage;

  /**
   * Template do popover de lançamentos diversos
   * @var  {Object} fixesPopover
   */
  variousPopover = VariousPopoverPage;

  /**
   * Página de relatório
   * @var  {Object} report
   */
  report:Object           = ReportPage;

  /**
   * Template da modal de relatorio
   * @var  {Object} fixesPopover
   */
  reportModal:Object = ReportModalPage;

  constructor() {}

}
