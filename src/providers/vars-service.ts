import { Injectable } from '@angular/core';

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

  constructor() {}

}
