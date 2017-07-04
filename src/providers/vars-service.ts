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
   * Avatar do usuário
   * @type {string}
   */
  public avatar = "./assets/images/totoro.png";

  /**
   * Cor do tema
   * @type {string}
   */
  public navColor = "primary";

  /**
   * Cor do tema da status bar
   * @type {string}
   */
  public variationStatusBar = "#216ded";

  /**
   * Cor do tema da botão de escolha das cores
   * @type {string}
   */
  public variationPalletButton = "danger";

  /**
   * Valor da salario
   * @type {float}
   */
  public income = 0.0;

  constructor() {}

}
