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
   * Nome do usuário
   * @var {string} name
   */
  public name = "";

  /**
   * Valor da salario
   * @var {float} income
   */
  public income = 0;

  constructor() {}

}
