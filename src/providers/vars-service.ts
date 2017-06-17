import { Injectable } from '@angular/core';

@Injectable()
export class VarsService {

  /**
   * Nome do banco de dados
   * @type {string}
   */
  public DBNAME     = "escolhafinanceira.db";

  /**
   * Caminho do banco de dados
   * @type {string}
   */
  public DBLOCATION = "default";

  /**
   * Nome do usuário
   * @type {string}
   */
  public name = "";

  /**
   * Valor da salario
   * @type {float}
   */
  public income = 0;

  constructor() {}

}
