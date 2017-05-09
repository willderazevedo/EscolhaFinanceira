import { Injectable } from '@angular/core';

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
   * Valor da carteira
   * @var {float} wallet
   */
  public wallet = 0;

  constructor() {}

}
